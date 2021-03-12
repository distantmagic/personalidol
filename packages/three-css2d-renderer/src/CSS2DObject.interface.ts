import type { Object3D } from "three/src/core/Object3D";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { DOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

export interface CSS2DObject<L extends DOMElementsLookup> extends Object3D {
  readonly element: string & keyof L;
  readonly state: Float32Array;
  readonly type: "CSS2DObject";

  isDirty: boolean;
  isDisposed: boolean;
  isRendered: boolean;
  props: DOMElementProps;
}
