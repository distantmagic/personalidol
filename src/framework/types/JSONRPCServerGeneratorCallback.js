// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { JSONRPCRequest } from "../interfaces/JSONRPCRequest";

export type JSONRPCServerGeneratorCallback<T> = (CancelToken, JSONRPCRequest) => AsyncGenerator<T, void, void>;
