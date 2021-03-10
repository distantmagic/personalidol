import type { Object3D } from "three/src/core/Object3D";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";

export interface CSS2DObject extends Object3D {
  readonly element: string;
  readonly state: Float32Array;
  readonly type: "CSS2DObject";

  isDirty: boolean;
  isDisposed: boolean;
  isRendered: boolean;
  props: DOMElementProps;
}
