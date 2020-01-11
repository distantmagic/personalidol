import { JSONRPCVersion } from "./JSONRPCVersion";

export type JSONRPCGeneratorChunkResponseObjectified<T> = {
  readonly chunk: string;
  readonly head: string;
  readonly id: string;
  readonly jsonrpc: JSONRPCVersion;
  readonly method: string;
  readonly next: null | string;
  readonly result: T;
  readonly type: "generator";
};
