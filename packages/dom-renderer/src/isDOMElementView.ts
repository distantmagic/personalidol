import { DOMElementView } from "./DOMElementView";

import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";
import type { DOMElementViewContext } from "./DOMElementViewContext.type";

export function isDOMElementView<C extends DOMElementViewContext>(item: HTMLElement): item is IDOMElementView<C> {
  return item instanceof DOMElementView;
}
