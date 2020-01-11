// @flow strict

import type { JSONRPCGeneratorChunkResponse } from "./JSONRPCGeneratorChunkResponse";

export interface JSONRPCClientGeneratorBuffer<T> {
  add(JSONRPCGeneratorChunkResponse<T>): void;

  flush(): Generator<JSONRPCGeneratorChunkResponse<T>, void, void>;

  getLastSent(): JSONRPCGeneratorChunkResponse<T>;

  hasLastSent(): boolean;

  isExpectingMore(): boolean;
}
