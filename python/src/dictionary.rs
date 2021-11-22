/*
 *  Copyright (c) 2021 Works Applications Co., Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

use std::path::{Path, PathBuf};
use std::sync::Arc;

use pyo3::exceptions::PyException;
use pyo3::prelude::*;
use pyo3::types::{PyString, PyTuple};
use sudachi::analysis::stateless_tokenizer::DictionaryAccess;

use sudachi::config::Config;
use sudachi::dic::dictionary::JapaneseDictionary;
use sudachi::dic::grammar::Grammar;
use sudachi::dic::lexicon_set::LexiconSet;
use sudachi::plugin::input_text::InputTextPlugin;
use sudachi::plugin::oov::OovProviderPlugin;
use sudachi::plugin::path_rewrite::PathRewritePlugin;

use crate::tokenizer::{PySplitMode, PyTokenizer};

pub(crate) struct PyDicData {
    pub(crate) dictionary: JapaneseDictionary,
    pub(crate) pos: Vec<Py<PyTuple>>,
}

impl DictionaryAccess for PyDicData {
    fn grammar(&self) -> &Grammar<'_> {
        self.dictionary.grammar()
    }

    fn lexicon(&self) -> &LexiconSet<'_> {
        self.dictionary.lexicon()
    }

    fn input_text_plugins(&self) -> &[Box<dyn InputTextPlugin + Sync + Send>] {
        self.dictionary.input_text_plugins()
    }

    fn oov_provider_plugins(&self) -> &[Box<dyn OovProviderPlugin + Sync + Send>] {
        self.dictionary.oov_provider_plugins()
    }

    fn path_rewrite_plugins(&self) -> &[Box<dyn PathRewritePlugin + Sync + Send>] {
        self.dictionary.path_rewrite_plugins()
    }
}

impl PyDicData {
    pub fn pos_of(&self, pos_id: u16) -> &Py<PyTuple> {
        &self.pos[pos_id as usize]
    }
}

/// A sudachi dictionary
#[pyclass(module = "sudachipy.dictionary", name = "Dictionary")]
#[pyo3(text_signature = "(config_path: str = ..., resource_dir: str = ..., dict_type: str = ...)")]
#[derive(Clone)]
#[repr(transparent)]
pub struct PyDictionary {
    pub(super) dictionary: Option<Arc<PyDicData>>,
}

#[pymethods]
impl PyDictionary {
    /// Creates a sudachi dictionary.
    ///
    /// If both config.systemDict and dict_type are not given, `sudachidict_core` is used.
    /// If both config.systemDict and dict_type are given, dict_type is used.
    /// If dict_type is an absolute path to a file, it is used as a dictionary
    #[new]
    #[args(config_path = "None", resource_dir = "None", dict_type = "None")]
    fn new(
        py: Python,
        config_path: Option<PathBuf>,
        resource_dir: Option<PathBuf>,
        dict_type: Option<&str>,
    ) -> PyResult<Self> {
        let config_path = match config_path {
            None => Some(get_default_setting_path(py)?),
            Some(v) => Some(v),
        };
        let resource_dir = match resource_dir {
            None => Some(get_default_resource_dir(py)?),
            Some(v) => Some(v),
        };
        let dict_path = match dict_type {
            None => None,
            Some(dt) => {
                let path = Path::new(dt);
                if path.is_absolute() && path.exists() {
                    Some(path.to_path_buf())
                } else {
                    Some(find_dict_path(py, dt)?)
                }
            }
        };

        let mut config = Config::new(config_path, resource_dir, dict_path).map_err(|e| {
            PyException::new_err(format!("Error loading config: {}", e.to_string()))
        })?;

        // Load a dictionary from `sudachidict_core` as the default one.
        // For this behavior, the value of `systemDict` key in the default setting file must be
        // empty (or no `systemDict` key), different from rust's one.
        if config.system_dict.is_none() || config.system_dict.as_ref().unwrap().is_dir() {
            config.system_dict = Some(find_dict_path(py, "core")?);
        }

        let jdic = JapaneseDictionary::from_cfg(&config).map_err(|e| {
            PyException::new_err(format!(
                "Error while constructing dictionary: {}",
                e.to_string()
            ))
        })?;

        let pos_data = jdic
            .grammar()
            .pos_list
            .iter()
            .map(|pos| {
                let tuple: Py<PyTuple> = PyTuple::new(py, pos).into_py(py);
                tuple
            })
            .collect();

        let dic_data = PyDicData {
            dictionary: jdic,
            pos: pos_data,
        };

        let dictionary = Arc::new(dic_data);

        Ok(Self {
            dictionary: Some(dictionary),
        })
    }

    /// Creates a sudachi tokenizer.
    ///
    /// Provide mode to set tokenizer's default split mode (C by default).
    #[pyo3(
        text_signature = "($self, mode: sudachipy.SplitMode = sudachipy.SplitMode.C) -> sudachipy.Tokenizer"
    )]
    #[args(mode = "None")]
    fn create(&self, mode: Option<PySplitMode>) -> PyTokenizer {
        let mode = mode.unwrap_or(PySplitMode::C).into();
        PyTokenizer::new(self.dictionary.as_ref().unwrap().clone(), mode)
    }

    /// Close this dictionary
    #[pyo3(text_signature = "($self)")]
    fn close(&mut self) {
        self.dictionary = None;
    }
}

pub(crate) fn get_default_setting_path(py: Python) -> PyResult<PathBuf> {
    let path = PyModule::import(py, "sudachipy")?.getattr("_DEFAULT_SETTINGFILE")?;
    let path = path.cast_as::<PyString>()?.to_str()?;
    Ok(PathBuf::from(path))
}

pub(crate) fn get_default_resource_dir(py: Python) -> PyResult<PathBuf> {
    let path = PyModule::import(py, "sudachipy")?.getattr("_DEFAULT_RESOURCEDIR")?;
    let path = path.cast_as::<PyString>()?.to_str()?;
    Ok(PathBuf::from(path))
}

fn find_dict_path(py: Python, dict_type: &str) -> PyResult<PathBuf> {
    let pyfunc = PyModule::import(py, "sudachipy")?.getattr("_find_dict_path")?;
    let path = pyfunc
        .call1((dict_type,))?
        .cast_as::<PyString>()?
        .to_str()?;
    Ok(PathBuf::from(path))
}
