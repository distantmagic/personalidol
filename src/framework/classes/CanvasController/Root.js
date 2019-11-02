// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasController from "../CanvasController";
import { default as CubeCanvasView } from "../CanvasView/Cube";

import type { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasControllerBus } from "../../interfaces/CanvasControllerBus";
import type { CanvasViewBus } from "../../interfaces/CanvasViewBus";
import type { ElementSize } from "../../interfaces/ElementSize";
import type { KeyboardState } from "../../interfaces/KeyboardState";
import type { PointerState } from "../../interfaces/PointerState";
import type { Resizeable } from "../../interfaces/Resizeable";

const CAMERA_FOV = 90;

export default class Root extends CanvasController implements Resizeable<"px"> {
  +camera: PerspectiveCamera;
  +canvasControllerBus: CanvasControllerBus;
  +canvasViewBus: CanvasViewBus;
  +keyboardState: KeyboardState;
  +pointerState: PointerState;
  +renderer: WebGLRenderer;
  +scene: Scene;

  constructor(
    canvasControllerBus: CanvasControllerBus,
    canvasViewBus: CanvasViewBus,
    keyboardState: KeyboardState,
    pointerState: PointerState,
    renderer: WebGLRenderer
  ) {
    super();
    autoBind(this);

    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, 0, 0.1, 1000);
    this.canvasControllerBus = canvasControllerBus;
    this.canvasViewBus = canvasViewBus;
    this.keyboardState = keyboardState;
    this.pointerState = pointerState;
    this.renderer = renderer;
    this.scene = new THREE.Scene();
  }

  draw(interpolationPercentage: number): void {
    this.renderer.render(this.scene, this.camera);
  }

  async lightsUp(cancelToken: CancelToken): Promise<void> {
    this.canvasViewBus.add(new CubeCanvasView(this.scene));
    this.camera.position.z = 5;
  }

  resize(elementSize: ElementSize<"px">): void {
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
