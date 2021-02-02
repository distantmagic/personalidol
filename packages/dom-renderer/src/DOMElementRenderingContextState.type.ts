import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export type DOMElementRenderingContextState = {
  needsRender: boolean;
  styleSheet: ReplaceableStyleSheet;
};
