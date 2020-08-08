import type { RPCResponseData } from "./RPCResponseData.type";

export type RPCResponseHandler<ResponseData extends RPCResponseData, MappedValue> = (data: ResponseData) => MappedValue;
