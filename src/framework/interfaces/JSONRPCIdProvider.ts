// @flow strict

export interface JSONRPCIdProvider {
  getNextId(): string;
}
