import { CancelToken } from "../interfaces/CancelToken";
import { JSONRPCRequest } from "../interfaces/JSONRPCRequest";
import { JSONRPCResponseData } from "../interfaces/JSONRPCResponseData";

export type JSONRPCServerGeneratorCallback<T> = (canelToken: CancelToken, request: JSONRPCRequest) => AsyncGenerator<JSONRPCResponseData<T>, void, void>;
