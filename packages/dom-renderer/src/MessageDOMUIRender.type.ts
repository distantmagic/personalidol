import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementsLookup } from "./DOMElementsLookup.type";

export type MessageDOMUIRender<L extends DOMElementsLookup> = {
  element: string & keyof L;
  id: string;
  props: DOMElementProps;
};
