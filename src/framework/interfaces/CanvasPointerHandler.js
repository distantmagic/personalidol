// @flow

export interface CanvasPointerHandler {
  onPointerAuxiliaryClick(): void;

  onPointerAuxiliaryDepressed(): void;

  onPointerAuxiliaryPressed(): void;

  onPointerOut(): void;

  onPointerOver(): void;

  onPointerPrimaryClick(): void;

  onPointerPrimaryDepressed(): void;

  onPointerPrimaryPressed(): void;

  onPointerSecondaryClick(): void;

  onPointerSecondaryDepressed(): void;

  onPointerSecondaryPressed(): void;
}
