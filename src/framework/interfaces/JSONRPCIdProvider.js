// @flow

export interface JSONRPCIdProvider {
  getNextId(): string;
}
