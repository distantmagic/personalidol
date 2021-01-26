import { isConstructableCSSStyleSheetSupported } from "@personalidol/support/src/isConstructableCSSStyleSheetSupported";

import { ReplaceableStyleSheet_constructable } from "./ReplaceableStyleSheet_constructable";
import { ReplaceableStyleSheet_element } from "./ReplaceableStyleSheet_element";

export const ReplaceableStyleSheet = isConstructableCSSStyleSheetSupported() ? ReplaceableStyleSheet_constructable : ReplaceableStyleSheet_element;
