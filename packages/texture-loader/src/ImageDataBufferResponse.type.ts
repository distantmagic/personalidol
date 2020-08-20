import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

export type ImageDataBufferResponse = RPCMessage & {
  imageDataBuffer: ArrayBuffer;
  imageDataHeight: number;
  imageDataWidth: number;
};
