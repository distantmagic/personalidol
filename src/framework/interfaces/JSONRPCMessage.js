// @flow

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { Objectable } from "./Objectable";

export interface JSONRPCMessage<U: {}> extends Objectable<U> {
  getId(): string;

  getMethod(): string;

  getType(): JSONRPCMessageType;

  isRequest(): boolean;

  isResponse(): boolean;
}
