import type { Object3D } from "three/src/core/Object3D";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";

import type { CSS2DObjectState } from "./CSS2DObjectState.type";

export interface CSS2DObject extends Object3D {
  readonly element: string;
  readonly state: CSS2DObjectState;
  readonly type: "CSS2DObject";

  isDirty: boolean;
  isDisposed: boolean;
  isRendered: boolean;
  props: DOMElementProps;
}
