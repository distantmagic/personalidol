import { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import { Objectable } from "./Objectable";

export interface JSONRPCMessage<U extends Object> extends Objectable<U> {
  getId(): string;

  getMethod(): string;

  getType(): JSONRPCMessageType;

  isRequest(): boolean;

  isResponse(): boolean;
}
