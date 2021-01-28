import type { Object3D } from "three/src/core/Object3D";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";

import type { CSS2DObjectState } from "./CSS2DObjectState.type";

export interface CSS2DObject extends Object3D {
  element: string;
  isCSS2DObject: true;
  props: DOMElementProps;
  state: CSS2DObjectState;
}
