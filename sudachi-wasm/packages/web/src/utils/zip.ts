import init, * as lib from "@hiogawa/zip.wasm";
import WASM_URL from "@hiogawa/zip.wasm/pkg/index_bg.wasm?url";
import { QueryObserverOptions, useQuery } from "@tanstack/react-query";
import _ from "lodash";

export const initZipWasm = _.memoize(initZipWasmImpl);

async function initZipWasmImpl() {
  await init(WASM_URL);
  return lib;
}

export function useZipWasm(options?: QueryObserverOptions<typeof lib>) {
  return useQuery({
    queryKey: [useZipWasm.name],
    queryFn: initZipWasm,
    staleTime: Infinity,
    ...options,
  });
}
