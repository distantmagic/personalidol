// @flow

import autoBind from "auto-bind";

import type { Raycaster, Scene } from "three";

import type { CanvasPointerController as CanvasPointerControllerInterface } from "../interfaces/CanvasPointerController";
import type { CanvasPointerResponder } from "../interfaces/CanvasPointerResponder";

export default class CanvasPointerController implements CanvasPointerControllerInterface {
  +raycaster: Raycaster;
  +scene: Scene;
  canvasPointerResponders: CanvasPointerResponder<any>[];

  constructor(raycaster: Raycaster, scene: Scene) {
    autoBind(this);

    this.canvasPointerResponders = [];
    this.raycaster = raycaster;
    this.scene = scene;
  }

  addResponder<T>(canvasPointerResponder: CanvasPointerResponder<T>): void {
    this.canvasPointerResponders.push(canvasPointerResponder);
  }

  begin(): void {
    const intersections = this.raycaster.intersectObjects(this.scene.children);

    if (intersections.length < 1) {
      for (let responder of this.canvasPointerResponders) {
        responder.onNothingIntersected();
      }

      return;
    }

    // use the first intersecting object only
    const intersecting = intersections[0];

    for (let responder of this.canvasPointerResponders) {
      const responsive = responder.makeResponsive(intersecting.object);
      if (responsive) {
        responder.respond(responsive);
      }
    }
  }

  deleteResponder<T>(canvasPointerResponder: CanvasPointerResponder<T>): void {
    this.canvasPointerResponders = this.canvasPointerResponders.filter(
      storedCanvasPointerResponder => storedCanvasPointerResponder !== canvasPointerResponder
    );
  }

  hasResponder<T>(canvasPointerResponder: CanvasPointerResponder<T>): boolean {
    return this.canvasPointerResponders.includes(canvasPointerResponder);
  }
}
