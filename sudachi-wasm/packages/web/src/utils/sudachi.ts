import init, * as lib from "@hiogawa/sudachi.wasm";
import WASM_URL from "@hiogawa/sudachi.wasm/pkg/index_bg.wasm?url";
import { QueryObserverOptions, useQuery } from "@tanstack/react-query";
import _ from "lodash";

export const initSudachiWasm = _.memoize(initSudachiWasmImpl);

async function initSudachiWasmImpl() {
  await init(WASM_URL);
  return lib;
}

export function useSudachiWasm(options?: QueryObserverOptions<typeof lib>) {
  return useQuery({
    queryKey: [useSudachiWasm.name],
    queryFn: initSudachiWasm,
    staleTime: Infinity,
    ...options,
  });
}
