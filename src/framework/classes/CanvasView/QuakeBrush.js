// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

import CanvasView from "../CanvasView";

import type { Mesh, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QuakeBrush as QuakeBrushInterface } from "../../interfaces/QuakeBrush";

export default class QuakeBrush extends CanvasView {
  +brush: QuakeBrushInterface;
  +scene: Scene;
  mesh: ?Mesh;

  constructor(canvasViewBag: CanvasViewBag, brush: QuakeBrushInterface, scene: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.brush = brush;
    this.mesh = null;
    this.scene = scene;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const vertices = this.brush.getVertices();

    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    });
    const geometry = new ConvexBufferGeometry(vertices);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;

    this.mesh = mesh;
    this.scene.add(mesh);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const mesh = this.mesh;

    if (!mesh) {
      return;
    }

    this.scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
}
