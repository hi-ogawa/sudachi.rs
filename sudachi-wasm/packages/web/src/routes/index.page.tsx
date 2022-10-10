import type { Morpheme } from "@hiogawa/sudachi.wasm";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Icon } from "../components/icon";
import { Spinner } from "../components/spinner";
import { segment } from "../utils/segment";
import {
  useLoadDictionary,
  useTokenize,
} from "../utils/tokenizer-worker-client";

export default function PageComponent() {
  //
  // form
  //
  interface FormType {
    fileList?: FileList;
    isDroppingFile: boolean;
    source: string;
  }
  const form = useForm<FormType>({
    defaultValues: { isDroppingFile: false, source: "" },
  });
  const { fileList, isDroppingFile, source } = form.watch();
  const file = React.useMemo(() => fileList?.[0], [fileList]);

  //
  // tokenizer-worker
  //

  const [morphemes, setMorphemes] = React.useState<Morpheme[]>([]);
  const segments = React.useMemo(() => segment(morphemes), [morphemes]);

  const mutationLoadDictionary = useLoadDictionary({
    onSuccess: () => {
      toast.success(`successfuly loaded dictionary`, {
        id: `${useLoadDictionary.name}:success`,
      });
    },
    onError: () => {
      toast.error(`failed to load dictionary`, {
        id: `${useLoadDictionary.name}:error`,
      });
    },
  });

  const mutationTokenize = useTokenize({
    onSuccess: (data) => {
      setMorphemes(data);
    },
    onError: () => {
      toast.error(`failed to tokenize input`);
    },
  });

  React.useEffect(() => {
    if (file) {
      mutationLoadDictionary.mutate(file);
    } else {
      mutationLoadDictionary.reset();
    }
  }, [file]);

  function runTokenizer(source: string) {
    source = source.replaceAll(/\s/g, " ").trim(); // normalize white space since new lines would break sudachi
    mutationTokenize.mutate(source);
  }

  const disabled = !mutationLoadDictionary.isSuccess;

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-2xl max-w-full flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl">sudachi.wasm</h1>
          <a
            className="opacity-[0.7] hover:opacity-100"
            href="https://github.com/hi-ogawa/sudachi.rs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="w-6 h-6" name="Logos/github-fill" />
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <label>
            <span>Dictionary</span>
            <span className="pl-2 text-sm text-gray-600">
              <span>Download from </span>
              <a
                className="text-blue-500 hover:underline"
                href="http://sudachi.s3-website-ap-northeast-1.amazonaws.com/sudachidict/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SudachiDict
              </a>
              <span> and drop it below</span>
            </span>
          </label>
          {/* https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#selecting_files_using_drag_and_drop */}
          {/* https://github.com/react-dropzone/react-dropzone/blob/81277590a45e8bbba32e544ba2ecbfa02284d916/src/index.js */}
          <label
            htmlFor="input-dictionary-file"
            className={cls(
              "h-[50px] bg-gray-100 border border-dashed border-gray-300 rounded flex justify-center items-center text-sm filter transition duration-200 relative",
              isDroppingFile ? "border-blue-500" : "border-gray-300",
              !file && "hover:brightness-[0.97] cursor-pointer"
            )}
            onDragEnter={(e) => {
              e.stopPropagation();
              e.preventDefault();
              form.setValue(
                "isDroppingFile",
                e.dataTransfer.types.includes("Files")
              );
            }}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
              form.setValue(
                "isDroppingFile",
                e.dataTransfer.types.includes("Files")
              );
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              e.preventDefault();
              form.setValue("isDroppingFile", false);
            }}
            onDrop={(e) => {
              e.stopPropagation();
              e.preventDefault();
              form.setValue("isDroppingFile", false);
              form.setValue("fileList", e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              id="input-dictionary-file"
              className="hidden"
              disabled={Boolean(file)}
              {...form.register("fileList")}
            />
            {!file && (
              <span className="text-sm text-gray-500">
                Load dictionary file (.zip or .dic) by drag-and-drop or file
                selection
              </span>
            )}
            {file && (
              <>
                <span
                  className={cls(
                    mutationLoadDictionary.isError
                      ? "text-red-600"
                      : "text-gray-700"
                  )}
                >
                  {file.name} ({Math.ceil(file.size / 2 ** 20)} MB)
                </span>
                {mutationLoadDictionary.isLoading && (
                  <span className="absolute right-3">
                    <Spinner size="1rem" />
                  </span>
                )}
                {!mutationLoadDictionary.isLoading && (
                  <button
                    className="absolute right-3 fill-gray-400 hover:fill-gray-700 transition duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.setValue("fileList", undefined);
                    }}
                  >
                    <Icon name="System/close-circle-line" className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <label>Input</label>
            <span className="flex-1"></span>
            <select
              data-test="select-example"
              disabled={disabled}
              className="border border-gray-300 px-1"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  const source = e.target.value;
                  form.setValue("source", source);
                  runTokenizer(source);
                }
              }}
            >
              <option value="">select example</option>
              {EXAMPLES.map((text, i) => (
                <option key={text} value={text}>
                  example {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col relative">
            <textarea
              data-test="textarea-sentence"
              disabled={disabled}
              className="p-1 border"
              rows={3}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.code === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  runTokenizer(source);
                }
              }}
              {...form.register("source")}
            />
          </div>
          <button
            className="p-1 border bg-gray-200 uppercase disabled:cursor-not-allowed filter disabled:text-gray-400 disabled:bg-gray-100 not-disabled:shadow not-disabled:hover:brightness-95 transition duration-200"
            title="Ctrl+Enter"
            onClick={() => runTokenizer(source)}
            disabled={!source || disabled}
          >
            run
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <label>Output</label>
          </div>
          <table className="w-full border bg-white">
            <thead>
              <tr className="px-2 border-b">
                <th className="px-2 py-1 text-left text-sm uppercase">
                  surface
                </th>
                <th className="px-2 py-1 text-left text-sm uppercase">
                  part of speech
                </th>
                <th className="px-2 py-1 text-left text-sm uppercase">
                  normalized form
                </th>
              </tr>
            </thead>
            {morphemes.length === 0 && (
              <tbody>
                <tr className="border-t h-8"></tr>
              </tbody>
            )}
            {morphemes.length > 0 && (
              <tbody>
                {morphemes.map((m, i) => (
                  <tr key={JSON.stringify({ i, m })} className="border-t">
                    <td className="px-2 py-1">{m.surface}</td>
                    <td className="px-2 py-1">
                      {m.part_of_speech.filter((p) => p !== "*").join(", ")}
                    </td>
                    <td className="px-2 py-1">{m.normalized_form}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <label>Line-Break Segmentation</label>
          </div>
          <pre
            className="p-1 border bg-white min-h-10"
            data-test="output-line-break-segmentation"
          >
            {segments
              .map((segment) => segment.map((m) => m.surface).join(""))
              .join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}

const EXAMPLES = [
  // https://www.cryptact.com/
  "仮想通貨の確定申告もこれで安心",
  // https://www.pafin.co/
  "当社サービスに関するニュースや最新情報をお届けします。",
  "アナリストによる企業分析、ヘッジファンド出身者によるマーケットレビュー、企業IRからの情報など、ここでしか見られない高品質な情報を元に、投資アイデアのシミュレーションや交換ができます。",
  "水面下50mまで潜って魚を捕らえることができる「自由自在」な鳥です。",
];

function cls(...args: any): string {
  return args.filter(Boolean).join(" ");
}

// @ts-ignore allow unused
function Debug(
  props: { d: any } & React.DetailedHTMLProps<
    React.DetailsHTMLAttributes<HTMLDetailsElement>,
    HTMLDetailsElement
  >
) {
  const { d, ...rest } = props;
  return (
    <details {...rest}>
      <summary onClick={() => console.log("debug", d)}>debug</summary>
      <pre>{JSON.stringify(d, null, 2)}</pre>
    </details>
  );
}
