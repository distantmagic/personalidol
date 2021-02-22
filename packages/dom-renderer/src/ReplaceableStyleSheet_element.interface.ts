import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export interface ReplaceableStyleSheet_element extends ReplaceableStyleSheet {
  readonly css: string;
  readonly isReplaceableStyleSheet_element: true;
}
