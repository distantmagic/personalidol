import type { MessageEventData } from "./MessageEventData.type";
import type { RPCLookupTable } from "./RPCLookupTable.type";

type Response<RequestData extends MessageEventData> = {
  [key in keyof RequestData]: any;
};

export async function sendRPCMessage<RequestData extends MessageEventData>(
  rpcLookupTable: RPCLookupTable,
  messagePort: MessagePort,
  data: RequestData,
  transferables: Array<Transferable> = []
): Promise<Response<RequestData>> {
  const types = Object.keys(data);
  const responses: Response<RequestData> = {} as Response<RequestData>;

  async function handleResponse(type: keyof RequestData): Promise<void> {
    const rpc = data[type].rpc;

    if ("string" !== typeof rpc) {
      throw new Error("Expected 'rpc' key to be a string.");
    }

    if (rpcLookupTable.hasOwnProperty(rpc)) {
      throw new Error("RPC message key is not unique.");
    }

    responses[type] = await new Promise(function (resolve) {
      rpcLookupTable[rpc] = resolve;
      messagePort.postMessage(data, transferables);
    });
  }

  await Promise.all(types.map(handleResponse));

  return responses;
}
