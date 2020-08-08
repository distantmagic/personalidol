import { MathUtils } from "three/src/math/MathUtils";

import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import type { Texture as ITexture } from "three";

import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

function pluckTexture(response: { loadImageBitmap: ITexture }): ITexture {
  return response.loadImageBitmap;
}

export function requestTexture(rpcLookupTable: RPCLookupTable, messagePort: MessagePort, textureUrl: string): Promise<ITexture> {
  return sendRPCMessage(rpcLookupTable, messagePort, {
    loadImageBitmap: {
      textureUrl: textureUrl,
      rpc: MathUtils.generateUUID(),
    },
  }).then(pluckTexture);
}
