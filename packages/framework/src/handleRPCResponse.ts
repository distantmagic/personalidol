import type { RPCLookupTable } from "./RPCLookupTable.type";
import type { RPCResponseHandler } from "./RPCResponseHandler.type";
import type { RPCMessage } from "./RPCMessage.type";

export function handleRPCResponse<ResponseData extends RPCMessage, MappedValue>(
  rpcLookupTable: RPCLookupTable,
  mapper: null | RPCResponseHandler<ResponseData, MappedValue> = null
) {
  return async function (data: ResponseData) {
    const rpc = data.rpc;

    if ("string" !== typeof rpc) {
      throw new Error("Expected RPC message ID in the message channel reply.");
    }

    if (!rpcLookupTable.hasOwnProperty(rpc)) {
      throw new Error(`No RPC handler registered for RPC ID: "${rpc}"`);
    }

    const handler = rpcLookupTable[rpc];

    if ("function" !== typeof handler) {
      throw new Error("RPC handler is not a function.");
    }

    delete rpcLookupTable[rpc];

    if ("function" === typeof mapper) {
      return handler(await mapper(data));
    }

    return handler(data);
  };
}
