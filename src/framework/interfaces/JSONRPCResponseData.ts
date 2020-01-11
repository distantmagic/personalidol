// @flow strict

import type { Transferables } from "../types/Transferables";

export interface JSONRPCResponseData<T> {
  getResult(): T;

  getTransferables(): $ReadOnlyArray<Transferables>;
}
