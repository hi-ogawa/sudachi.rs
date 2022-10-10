import { useMutation } from "@tanstack/react-query";
import * as Comlink from "comlink";
import _ from "lodash";
import type { UseMutationOptions } from "rakkasjs";
import type { Morpheme } from "../../../../pkg";
import type { TokenizerWorker } from "./tokenizer-worker";
import Worker from "./tokenizer-worker?worker";

const getTokenizerWorker = _.memoize(async () => {
  const worker = Comlink.wrap<TokenizerWorker>(new Worker());
  await worker.initialize();
  return worker;
});

export function useLoadDictionary(options?: UseMutationOptions<void, File>) {
  return useMutation(async (file: File) => {
    const worker = await getTokenizerWorker();
    await worker.loadDictionary(file);
  }, options as any);
}

export function useTokenize(options?: UseMutationOptions<Morpheme[], string>) {
  return useMutation(async (input: string) => {
    const worker = await getTokenizerWorker();
    return worker.run(input);
  }, options as any);
}
