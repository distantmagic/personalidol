import { MathUtils } from "three/src/math/MathUtils";

import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

function pluckTexture<T>(response: { createImageBitmap: T }): T {
  return response.createImageBitmap;
}

export function requestTexture<T>(rpcLookupTable: RPCLookupTable, messagePort: MessagePort, textureUrl: string): Promise<T> {
  return sendRPCMessage(rpcLookupTable, messagePort, {
    createImageBitmap: {
      textureUrl: textureUrl,
      rpc: MathUtils.generateUUID(),
    },
  }).then(pluckTexture);
}
