// @flow

import type { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../interfaces/JSONRPCResponseData";
import type { Transferables } from "../types/Transferables";

export default class JSONRPCResponseData<T> implements JSONRPCResponseDataInterface<T> {
  +result: T;
  +transferables: $ReadOnlyArray<Transferables>;

  constructor(result: T, transferables: $ReadOnlyArray<Transferables> = []) {
    this.result = result;
    this.transferables = transferables;
  }

  getResult(): T {
    return this.result;
  }

  getTransferables(): $ReadOnlyArray<Transferables> {
    return this.transferables;
  }
}
