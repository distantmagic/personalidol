// @flow

import type { JSONRPCMessageType } from "../types/JSONRPCMessageType";
import type { Serializable } from "./Serializable";

export interface JSONRPCMessage extends Serializable {
  getId(): string;

  getMethod(): string;

  getType(): JSONRPCMessageType;

  isRequest(): boolean;

  isResponse(): boolean;
}
