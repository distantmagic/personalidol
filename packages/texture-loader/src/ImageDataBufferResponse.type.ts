import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

export type ImageDataBufferResponse = RPCMessage & {
  imageDataBuffer: ArrayBuffer;
  imageDataHeight: number;
  imageDataWidth: number;
};
