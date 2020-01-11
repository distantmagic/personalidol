import { CancelToken } from "../interfaces/CancelToken";
import { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export type JSONRPCServerPromiseCallback<T> = (cancelToken: CancelToken, request: JSONRPCRequest) => Promise<JSONRPCResponseData<T>>;
