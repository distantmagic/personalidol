import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

type JSONRPCServerPromiseCallback<T, U> = (cancelToken: CancelToken, request: JSONRPCRequest<T>) => Promise<JSONRPCResponseData<U>>;

export default JSONRPCServerPromiseCallback;
