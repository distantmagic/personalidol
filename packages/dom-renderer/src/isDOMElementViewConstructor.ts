import { DOMElementView } from "./DOMElementView";
import { isHTMLElementConstructor } from "./isHTMLElementConstructor";

export function isDOMElementViewConstructor(item: any): item is typeof DOMElementView {
  if ("function" !== typeof item) {
    return false;
  }

  if (!isHTMLElementConstructor(item)) {
    return false;
  }

  return item.prototype instanceof DOMElementView;
}
