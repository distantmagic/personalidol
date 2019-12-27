// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import type { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export type JSONRPCServerGeneratorCallback<T> = (CancelToken, JSONRPCRequest) => AsyncGenerator<JSONRPCResponseData<T>, void, void>;
