import * as THREE from "three";
import autoBind from "auto-bind";

import { default as ICanvasPointerInteraction } from "src/framework/interfaces/CanvasPointerInteraction";
import { default as IElementSize } from "src/framework/interfaces/ElementSize";

export default class CanvasPointerInteraction implements ICanvasPointerInteraction {
  readonly camera: THREE.Camera;
  readonly mouseVector: THREE.Vector2;
  readonly raycaster: THREE.Raycaster;
  readonly renderer: THREE.WebGLRenderer;
  private canvasHeight: number;
  private canvasOffsetLeft: number;
  private canvasOffsetTop: number;
  private canvasWidth: number;

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    autoBind(this);

    this.camera = camera;
    this.canvasHeight = 0;
    this.canvasOffsetLeft = 0;
    this.canvasOffsetTop = 0;
    this.canvasWidth = 0;
    this.mouseVector = new THREE.Vector2(-1, -1);
    this.raycaster = new THREE.Raycaster();
    this.renderer = renderer;
  }

  disconnect(): void {
    const domElement = this.renderer.domElement;

    domElement.removeEventListener("contextmenu", this.onContextMenu);
    domElement.removeEventListener("mousedown", this.onMouseChange);
    domElement.removeEventListener("mousedown", this.onMouseDown);
    domElement.removeEventListener("mousemove", this.onMouseChange);
    domElement.removeEventListener("mouseup", this.onMouseChange);
    domElement.removeEventListener("mouseup", this.onMouseUp);
    domElement.removeEventListener("wheel", this.onWheel);
  }

  observe(): void {
    const domElement = this.renderer.domElement;
    const optionsPassive = {
      capture: true,
      passive: true,
    };

    domElement.addEventListener("contextmenu", this.onContextMenu);
    domElement.addEventListener("mousedown", this.onMouseChange, optionsPassive);
    domElement.addEventListener("mousedown", this.onMouseDown);
    domElement.addEventListener("mousemove", this.onMouseChange, optionsPassive);
    domElement.addEventListener("mouseup", this.onMouseChange, optionsPassive);
    domElement.addEventListener("mouseup", this.onMouseUp);
    domElement.addEventListener("wheel", this.onWheel);
  }

  onContextMenu(evt: MouseEvent): void {
    evt.preventDefault();
  }

  onMouseChange(evt: MouseEvent): void {
    const relativeX = evt.clientX - this.canvasOffsetLeft;
    const relativeY = evt.clientY - this.canvasOffsetTop;

    this.mouseVector.x = (relativeX / this.canvasWidth) * 2 - 1;
    this.mouseVector.y = -1 * (relativeY / this.canvasHeight) * 2 + 1;
  }

  onMouseDown(evt: MouseEvent): void {}

  onMouseMove(evt: MouseEvent): void {}

  onMouseUp(evt: MouseEvent): void {}

  onWheel(evt: MouseEvent): void {}

  resize(elementSize: IElementSize<"px">): void {
    const boundingRect = this.renderer.domElement.getBoundingClientRect();

    this.canvasHeight = elementSize.getHeight();
    this.canvasOffsetLeft = boundingRect.left;
    this.canvasOffsetTop = boundingRect.top;
    this.canvasWidth = elementSize.getWidth();
  }

  update(delta: number): void {
    this.raycaster.setFromCamera(this.mouseVector, this.camera);
  }

  useUpdate(): boolean {
    return true;
  }
}
