// @flow

import type { JSONRPCResponse } from "./JSONRPCResponse";

export interface JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T> {
  getChunk(): string;

  getHead(): string;

  getNext(): string;

  getType(): "generator";

  hasNext(): boolean;

  isHead(): boolean;

  setNext(string): void;
}
