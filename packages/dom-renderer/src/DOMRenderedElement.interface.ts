import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";

import type { DOMUpdatesProps } from "./DOMUpdatesProps.interface";

export interface DOMRenderedElement extends DOMUpdatesProps, Mountable, Nameable {
  isDOMRenderedElement: true;
}
