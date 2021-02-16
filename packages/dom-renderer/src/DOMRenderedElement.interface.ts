import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMUpdatesProps } from "./DOMUpdatesProps.interface";

export interface DOMRenderedElement<T extends DOMElementsLookup> extends DOMUpdatesProps, Mountable, Nameable {
  isDOMRenderedElement: true;
}
