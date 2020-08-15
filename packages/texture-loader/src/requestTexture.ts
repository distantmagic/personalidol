import { MathUtils } from "three/src/math/MathUtils";

import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

import type { TextureRequest } from "./TextureRequest.type";

function pluckTexture<T>(response: { createImageBitmap: T }): T {
  return response.createImageBitmap;
}

export function requestTexture<T>(rpcLookupTable: RPCLookupTable, messagePort: MessagePort, textureUrl: string, flipY: boolean = true): Promise<T> {
  const textureRequest: TextureRequest = {
    flipY: flipY,
    textureUrl: textureUrl,
    rpc: MathUtils.generateUUID(),
  };

  return sendRPCMessage(rpcLookupTable, messagePort, {
    createImageBitmap: textureRequest,
  }).then(pluckTexture);
}
