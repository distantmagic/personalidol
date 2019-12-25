// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCRequest } from "../interfaces/JSONRPCRequest";

export type JSONRPCServerPromiseCallback<T> = (CancelToken, JSONRPCRequest) => Promise<T>;
