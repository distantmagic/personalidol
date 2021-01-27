import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

export type TextureRequest = RPCMessage & {
  textureUrl: string;
};
