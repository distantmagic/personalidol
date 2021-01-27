import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

export type ImageBitmapResponse = RPCMessage & {
  imageBitmap: ImageBitmap;
};
