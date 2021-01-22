import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";

import type { DOMElementProps } from "./DOMElementProps.type";

export interface DOMElementView extends HTMLElement, MainLoopUpdatable {
  props: DOMElementProps;
  propsLastUpdate: number;
  uiMessagePort: null | MessagePort;
  viewLastUpdate: number;
}
