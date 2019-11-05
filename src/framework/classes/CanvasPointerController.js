// @flow

import autoBind from "auto-bind";

import CanvasPointerHandlerReference from "./CanvasPointerHandlerReference";

import type { Raycaster, Scene } from "three";

import type { CanvasPointerController as CanvasPointerControllerInterface } from "../interfaces/CanvasPointerController";
import type { CanvasPointerHandler } from "../interfaces/CanvasPointerHandler";
import type { PointerState } from "../interfaces/PointerState";

export default class CanvasPointerController implements CanvasPointerControllerInterface {
  +pointerState: PointerState;
  +raycaster: Raycaster;
  +scene: Scene;

  constructor(pointerState: PointerState, raycaster: Raycaster, scene: Scene) {
    autoBind(this);

    this.pointerState = pointerState;
    this.raycaster = raycaster;
    this.scene = scene;
  }

  begin(): void {
    const intersections = this.raycaster.intersectObjects(this.scene.children);

    for (let intersecting of intersections) {
      if (intersecting.object.userData instanceof CanvasPointerHandlerReference) {
        this.onPointerHandlerInteracted(intersecting.object.userData.getCanvasPointerHandler());
        break;
      }
    }
  }

  onPointerHandlerInteracted(pointerHandler: CanvasPointerHandler): void {
    pointerHandler.onMouseOver();
    if (this.pointerState.isPressed("Auxilary")) {
      pointerHandler.onMouseAuxilaryPressed();
    }
    if (this.pointerState.isPressed("Primary")) {
      pointerHandler.onMousePrimaryPressed();
    }
    if (this.pointerState.isPressed("Secondary")) {
      pointerHandler.onMouseSecondaryPressed();
    }
  }
}
