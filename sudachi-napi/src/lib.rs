use std::path::PathBuf;

use napi::bindgen_prelude::{Error, Result, Status};
use napi_derive::napi;
use sudachi::analysis::stateful_tokenizer::StatefulTokenizer;
use sudachi::config::Config;
use sudachi::dic::dictionary::JapaneseDictionary;
use sudachi::prelude::{Mode, MorphemeList};

#[napi]
pub struct SudachiJs {
    dict: JapaneseDictionary,
    mode: Mode,
}

#[napi(object)]
pub struct MorphemeJs {
    // https://github.com/WorksApplications/sudachi.rs/blob/ae7769a3e88b92de2f80f03de8c8cc3925e6c136/sudachi-cli/src/output.rs#L106
    pub surface: String,
    pub part_of_speech: Vec<String>,
    pub normalized_form: String,
}

#[napi]
impl SudachiJs {
    #[napi(factory)]
    pub fn create(
        config_file: Option<String>,
        resource_dir: Option<String>,
        dictionary_path: Option<String>,
        mode: Option<String>,
    ) -> Result<Self> {
        //
        // initialize dictionary
        //
        let config = Config::new(
            config_file.map(PathBuf::from),
            resource_dir.map(PathBuf::from),
            dictionary_path.map(PathBuf::from),
        )
        .map_err(to_generic_failure)?;

        let dict = JapaneseDictionary::from_cfg(&config).map_err(to_generic_failure)?;

        let mode: Mode = mode
            .unwrap_or("C".to_string())
            .parse()
            .map_err(to_generic_failure)?;

        Ok(Self { dict, mode })
    }

    #[napi]
    pub fn run(&self, input: String) -> Result<Vec<MorphemeJs>> {
        // initialize struct
        let mut analyzer = StatefulTokenizer::new(&self.dict, self.mode);
        let mut morphemes = MorphemeList::empty(&self.dict);

        // tokenize
        analyzer.reset().push_str(&input);
        analyzer.do_tokenize().map_err(to_generic_failure)?;
        morphemes
            .collect_results(&mut analyzer)
            .map_err(to_generic_failure)?;

        // post process
        let result = morphemes
            .iter()
            .map(|m| MorphemeJs {
                surface: m.surface().to_string(),
                part_of_speech: m.part_of_speech().iter().map(|v| v.to_string()).collect(),
                normalized_form: m.normalized_form().to_string(),
            })
            .collect();
        Ok(result)
    }

    #[napi]
    pub fn destroy(&self) -> Result<()> {
        Err(to_generic_failure("not implemented"))
    }
}

//
// napi utils
//

fn to_generic_failure<T: ToString>(e: T) -> Error {
    Error::new(Status::GenericFailure, e.to_string())
}
