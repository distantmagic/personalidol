import JSONRPCVersion from "src/framework/types/JSONRPCVersion";

type JSONRPCGeneratorChunkResponseObjectified<T> = {
  readonly chunk: string;
  readonly head: string;
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly next: null | string;
  readonly result: T;
  readonly type: "generator";
};

export default JSONRPCGeneratorChunkResponseObjectified;
