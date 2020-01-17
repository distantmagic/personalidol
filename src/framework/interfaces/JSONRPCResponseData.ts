export default interface JSONRPCResponseData<T> {
  getResult(): T;

  getTransferables(): Transferable[];
}
