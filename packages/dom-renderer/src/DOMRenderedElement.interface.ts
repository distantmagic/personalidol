import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Nameable } from "@personalidol/framework/src/Nameable.interface";

import type { DOMElementProps } from "./DOMElementProps.type";

export interface DOMRenderedElement extends Mountable, Nameable {
  isDOMRenderedElement: true;

  updateProps(props: DOMElementProps): void;
}
