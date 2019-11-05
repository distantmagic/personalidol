// @flow

export interface CanvasPointerHandler {
  onMouseAuxilaryPressed(): void;

  onMouseOver(): void;

  onMousePrimaryPressed(): void;

  onMouseSecondaryPressed(): void;
}
