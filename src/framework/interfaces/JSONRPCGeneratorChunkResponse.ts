import JSONRPCMessageType from "src/framework/enums/JSONRPCMessageType";

import JSONRPCResponse from "src/framework/interfaces/JSONRPCResponse";

import JSONRPCGeneratorChunkResponseObjectified from "src/framework/types/JSONRPCGeneratorChunkResponseObjectified";

export default interface JSONRPCGeneratorChunkResponse<T> extends JSONRPCResponse<T, JSONRPCGeneratorChunkResponseObjectified<T>> {
  getChunk(): string;

  getHead(): string;

  getNext(): string;

  getType(): JSONRPCMessageType.Generator;

  hasNext(): boolean;

  isHead(): boolean;

  setNext(next: string): void;
}
