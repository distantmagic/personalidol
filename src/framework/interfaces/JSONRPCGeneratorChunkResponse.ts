import { JSONRPCResponse } from "./JSONRPCResponse";
import { JSONRPCGeneratorChunkResponseObjectified } from "../types/JSONRPCGeneratorChunkResponseObjectified";

export interface JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T, JSONRPCGeneratorChunkResponseObjectified<T>> {
  getChunk(): string;

  getHead(): string;

  getNext(): string;

  getType(): "generator";

  hasNext(): boolean;

  isHead(): boolean;

  setNext(next: string): void;
}
