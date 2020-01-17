import { default as IJSONRPCResponseData } from "src/framework/interfaces/JSONRPCResponseData";

export default class JSONRPCResponseData<T> implements IJSONRPCResponseData<T> {
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
