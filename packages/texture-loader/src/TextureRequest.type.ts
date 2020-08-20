import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

export type TextureRequest = RPCMessage & {
  textureUrl: string;
};
