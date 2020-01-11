import { JSONRPCGeneratorChunkResponse } from "./JSONRPCGeneratorChunkResponse";

export interface JSONRPCClientGeneratorBuffer<T> {
  add(response: JSONRPCGeneratorChunkResponse<T>): void;

  flush(): Generator<JSONRPCGeneratorChunkResponse<T>, void, void>;

  getLastSent(): JSONRPCGeneratorChunkResponse<T>;

  hasLastSent(): boolean;

  isExpectingMore(): boolean;
}
