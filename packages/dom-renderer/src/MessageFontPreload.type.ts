import type { FontPreloadParameters } from "./FontPreloadParameters.type";
import type { RPCMessage } from "@personalidol/workers/src/RPCMessage.type";

export type MessageFontPreload = {
  preloadFont: FontPreloadParameters & RPCMessage;
};
