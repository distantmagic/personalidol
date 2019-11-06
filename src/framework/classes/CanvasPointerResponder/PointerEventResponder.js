// @flow

import { Object3D } from "three";

import CanvasPointerEventHandlerReference from "../CanvasPointerEventHandlerReference";

import type { CanvasPointerResponder } from "../../interfaces/CanvasPointerResponder";
import type { CanvasPointerEventHandler } from "../../interfaces/CanvasPointerEventHandler";
import type { CanvasPointerEventHandlerReference as CanvasPointerEventHandlerReferenceInterface } from "../../interfaces/CanvasPointerEventHandlerReference";
import type { PointerButtonNames } from "../../types/PointerButtonNames";
import type { PointerState } from "../../interfaces/PointerState";

export default class PointerEventResponder
  implements CanvasPointerResponder<CanvasPointerEventHandlerReferenceInterface> {
  +pointerState: PointerState;

  static observedButtons = ["Auxiliary", "Primary", "Secondary"];

  previouslyPressed: Map<PointerButtonNames, ?CanvasPointerEventHandler>;
  previouslyIntersected: ?CanvasPointerEventHandler;

  constructor(pointerState: PointerState) {
    this.pointerState = pointerState;
    this.previouslyIntersected = null;
    this.previouslyPressed = new Map<PointerButtonNames, ?CanvasPointerEventHandler>();
  }

  makeResponsive(object: Object3D): ?CanvasPointerEventHandlerReferenceInterface {
    if (object.userData instanceof CanvasPointerEventHandlerReference) {
      return object.userData;
    }
  }

  notifyClick(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerEventHandler): void {
    switch (pointerButtonName) {
      case "Auxiliary":
        pointerHandler.onPointerAuxiliaryClick();
        return;
      case "Primary":
        pointerHandler.onPointerPrimaryClick();
        return;
      case "Secondary":
        pointerHandler.onPointerSecondaryClick();
        return;
      default:
        return;
    }
  }

  notifyDepressed(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerEventHandler): void {
    switch (pointerButtonName) {
      case "Auxiliary":
        pointerHandler.onPointerAuxiliaryDepressed();
        return;
      case "Primary":
        pointerHandler.onPointerPrimaryDepressed();
        return;
      case "Secondary":
        pointerHandler.onPointerSecondaryDepressed();
        return;
      default:
        return;
    }
  }

  notifyPressed(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerEventHandler): void {
    switch (pointerButtonName) {
      case "Auxiliary":
        pointerHandler.onPointerAuxiliaryPressed();
        return;
      case "Primary":
        pointerHandler.onPointerPrimaryPressed();
        return;
      case "Secondary":
        pointerHandler.onPointerSecondaryPressed();
        return;
      default:
        return;
    }
  }

  onNothingIntersected(): void {
    const previouslyIntersected = this.previouslyIntersected;

    if (previouslyIntersected) {
      previouslyIntersected.onPointerOut();
    }

    for (let pointerButtonName of PointerEventResponder.observedButtons) {
      if (!this.pointerState.isPressed(pointerButtonName)) {
        this.previouslyPressed.delete(pointerButtonName);
      }
    }

    this.previouslyIntersected = null;
  }

  onPointerHandlerInteracted(pointerHandler: CanvasPointerEventHandler): void {
    const previouslyIntersected = this.previouslyIntersected;

    if (previouslyIntersected && previouslyIntersected !== pointerHandler) {
      previouslyIntersected.onPointerOut();
    }
    if (previouslyIntersected !== pointerHandler) {
      pointerHandler.onPointerOver();
    }

    for (let pointerButtonName of PointerEventResponder.observedButtons) {
      const previouslyPressed = this.previouslyPressed.get(pointerButtonName);

      if (this.pointerState.isPressed(pointerButtonName)) {
        if (!previouslyPressed) {
          this.notifyPressed(pointerButtonName, pointerHandler);
          this.previouslyPressed.set(pointerButtonName, pointerHandler);
        }
      } else {
        if (previouslyPressed) {
          this.notifyDepressed(pointerButtonName, pointerHandler);
        }
        if (previouslyPressed === pointerHandler) {
          this.notifyClick(pointerButtonName, pointerHandler);
        }
        this.previouslyPressed.delete(pointerButtonName);
      }
    }

    this.previouslyIntersected = pointerHandler;
  }

  respond(canvasPointerEventHandlerReference: CanvasPointerEventHandlerReferenceInterface): void {
    const pointerHandler = canvasPointerEventHandlerReference.getCanvasPointerEventHandler();

    this.onPointerHandlerInteracted(pointerHandler);
  }
}
