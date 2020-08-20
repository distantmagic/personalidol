import type { ImagePreloadParameters } from "./ImagePreloadParameters.type";
import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

export type ImagePreloadMessage = {
  preloadImage: ImagePreloadParameters & RPCMessage;
};
