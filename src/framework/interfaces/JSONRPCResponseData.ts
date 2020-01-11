export interface JSONRPCResponseData<T> {
  getResult(): T;

  getTransferables(): Transferable[];
}
