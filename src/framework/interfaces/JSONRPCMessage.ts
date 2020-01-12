import { JSONRPCMessageType } from "src/framework/types/JSONRPCMessageType";
import { Objectable } from "src/framework/interfaces/Objectable";

export interface JSONRPCMessage<U extends Object> extends Objectable<U> {
  getId(): string;

  getMethod(): string;

  getType(): JSONRPCMessageType;

  isRequest(): boolean;

  isResponse(): boolean;
}
