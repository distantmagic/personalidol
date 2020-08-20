import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

export type ImageBitmapResponse = RPCMessage & {
  imageBitmap: ImageBitmap;
};
