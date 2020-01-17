import JSONRPCGeneratorChunkResponse from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";

export default interface JSONRPCClientGeneratorBuffer<T> {
  add(response: JSONRPCGeneratorChunkResponse<T>): void;

  flush(): Generator<JSONRPCGeneratorChunkResponse<T>>;

  getLastSent(): JSONRPCGeneratorChunkResponse<T>;

  hasLastSent(): boolean;

  isExpectingMore(): boolean;
}
