import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCResponseData from "src/framework/interfaces/JSONRPCResponseData";

type JSONRPCServerGeneratorCallback<T, U> = (canelToken: CancelToken, request: JSONRPCRequest<T>) => AsyncGenerator<JSONRPCResponseData<U>>;

export default JSONRPCServerGeneratorCallback;
