// @flow strict

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import type { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export type JSONRPCServerPromiseCallback<T> = (CancelToken, JSONRPCRequest) => Promise<JSONRPCResponseData<T>>;
