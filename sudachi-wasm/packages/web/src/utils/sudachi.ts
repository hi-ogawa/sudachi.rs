import initSudachiWasm, * as sudachiWasm from "@hiogawa/sudachi.wasm";
import SUDACHI_WASM_URL from "@hiogawa/sudachi.wasm/pkg/index_bg.wasm?url";
import { QueryObserverOptions, useQuery } from "@tanstack/react-query";

export function useSudachiWasm(
  options?: QueryObserverOptions<typeof sudachiWasm>
) {
  return useQuery({
    queryKey: [useSudachiWasm.name],
    queryFn: async () => {
      await initSudachiWasm(SUDACHI_WASM_URL);
      return sudachiWasm;
    },
    staleTime: Infinity,
    ...options,
  });
}
