import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

type JSONRPCServerGeneratorCallback<T> = (canelToken: CancelToken, request: JSONRPCRequest) => AsyncGenerator<JSONRPCResponseData<T>>;

export default JSONRPCServerGeneratorCallback;
