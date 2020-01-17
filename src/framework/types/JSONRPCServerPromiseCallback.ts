import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

type JSONRPCServerPromiseCallback<T> = (cancelToken: CancelToken, request: JSONRPCRequest) => Promise<JSONRPCResponseData<T>>;

export default JSONRPCServerPromiseCallback;
