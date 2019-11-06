// @flow

import type { Object3D } from "three";

export interface CanvasPointerResponder<T> {
  makeResponsive(Object3D): ?T;

  onNothingIntersected(): void;

  respond(T): void;
}
