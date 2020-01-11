import { JSONRPCResponseData as JSONRPCResponseDataInterface } from "../interfaces/JSONRPCResponseData";

export default class JSONRPCResponseData<T> implements JSONRPCResponseDataInterface<T> {
  readonly result: T;
  readonly transferables: Transferable[];

  constructor(result: T, transferables: Transferable[] = []) {
    this.result = result;
    this.transferables = transferables;
  }

  getResult(): T {
    return this.result;
  }

  getTransferables(): Transferable[] {
    return this.transferables;
  }
}
