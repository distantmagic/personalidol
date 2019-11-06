// @flow

import autoBind from "auto-bind";

import CanvasPointerHandlerReference from "./CanvasPointerHandlerReference";

import type { Raycaster, Scene } from "three";

import type { CanvasPointerController as CanvasPointerControllerInterface } from "../interfaces/CanvasPointerController";
import type { CanvasPointerHandler } from "../interfaces/CanvasPointerHandler";
import type { PointerButtonNames } from "../types/PointerButtonNames";
import type { PointerState } from "../interfaces/PointerState";

export default class CanvasPointerController implements CanvasPointerControllerInterface {
  +pointerState: PointerState;
  +raycaster: Raycaster;
  +scene: Scene;
  previouslyPressed: Map<PointerButtonNames, ?CanvasPointerHandler>;
  previouslyIntersected: ?CanvasPointerHandler;

  static observedButtons = ["Auxiliary", "Primary", "Secondary"];

  constructor(pointerState: PointerState, raycaster: Raycaster, scene: Scene) {
    autoBind(this);

    this.pointerState = pointerState;
    this.previouslyIntersected = null;
    this.previouslyPressed = new Map<PointerButtonNames, ?CanvasPointerHandler>();
    this.raycaster = raycaster;
    this.scene = scene;
  }

  begin(): void {
    const intersections = this.raycaster.intersectObjects(this.scene.children);

    for (let intersecting of intersections) {
      if (intersecting.object.userData instanceof CanvasPointerHandlerReference) {
        const pointerHandler = intersecting.object.userData.getCanvasPointerHandler();

        this.onPointerHandlerInteracted(pointerHandler);
        return;
      }
    }

    this.onNonePointerHandlerInteracted();
  }

  notifyPressed(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerHandler): void {
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

  notifyDepressed(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerHandler): void {
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

  notifyClick(pointerButtonName: PointerButtonNames, pointerHandler: CanvasPointerHandler): void {
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

  onNonePointerHandlerInteracted(): void {
    const previouslyIntersected = this.previouslyIntersected;

    if (previouslyIntersected) {
      previouslyIntersected.onPointerOut();
    }

    for (let pointerButtonName of CanvasPointerController.observedButtons) {
      if (!this.pointerState.isPressed(pointerButtonName)) {
        this.previouslyPressed.delete(pointerButtonName);
      }
    }

    this.previouslyIntersected = null;
  }

  onPointerHandlerInteracted(pointerHandler: CanvasPointerHandler): void {
    const previouslyIntersected = this.previouslyIntersected;

    if (previouslyIntersected && previouslyIntersected !== pointerHandler) {
      previouslyIntersected.onPointerOut();
    }
    if (previouslyIntersected !== pointerHandler) {
      pointerHandler.onPointerOver();
    }

    for (let pointerButtonName of CanvasPointerController.observedButtons) {
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
}
