import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";
import type { ReplaceableStyleSheet_element } from "./ReplaceableStyleSheet_element.interface";

export function isReplaceableStyleSheet_element(stylesheet: ReplaceableStyleSheet): stylesheet is ReplaceableStyleSheet_element {
  return true === (stylesheet as ReplaceableStyleSheet_element).isReplaceableStyleSheet_element;
}
