import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementsLookup } from "./DOMElementsLookup.type";

export type MessageDOMUIRender<T extends DOMElementsLookup> = {
  element: string & keyof T;
  id: string;
  props: DOMElementProps;
};
