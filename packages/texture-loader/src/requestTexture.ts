import { generateUUID } from "@personalidol/math/src/generateUUID";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";

import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";

import type { TextureRequest } from "./TextureRequest.type";

function pluckTexture<T>(response: { createImageBitmap: T }): T {
  return response.createImageBitmap;
}

export function requestTexture<T>(rpcLookupTable: RPCLookupTable, texturesMessagePort: MessagePort, textureUrl: string): Promise<T> {
  const textureRequest: TextureRequest = {
    textureUrl: textureUrl,
    rpc: generateUUID(),
  };

  return sendRPCMessage(rpcLookupTable, texturesMessagePort, {
    createImageBitmap: textureRequest,
  }).then(pluckTexture);
}
