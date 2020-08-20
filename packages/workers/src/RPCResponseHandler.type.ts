import type { RPCMessage } from "./RPCMessage.type";

export type RPCResponseHandler<ResponseData extends RPCMessage, MappedValue> = (data: ResponseData) => MappedValue;
