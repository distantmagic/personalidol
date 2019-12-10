// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

import CanvasView from "../CanvasView";
import quake2three from "../../helpers/quake2three";

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

  async loadTexture(): Promise<any> {
    return new Promise(resolve => {
      new THREE.TextureLoader().load("textures/texture-cardboard-512x512.png", texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.25, 0.25);

        resolve(texture);
      });
    });
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const vertices = this.brush.getVertices().map(quake2three);

    const material = new THREE.MeshLambertMaterial({
      // color: 0xffffff,
      map: await this.loadTexture(),
      // opacity: 0.6,
      // transparent: true,
    });

    const geometry = new ConvexGeometry(vertices);
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
