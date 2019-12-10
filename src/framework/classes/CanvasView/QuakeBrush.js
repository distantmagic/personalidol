// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import QuakeBrushGeometry from "../QuakeBrushGeometry";

import type { Group, Mesh } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QuakeBrush as QuakeBrushInterface } from "../../interfaces/QuakeBrush";

export default class QuakeBrush extends CanvasView {
  +brush: QuakeBrushInterface;
  +group: Group;
  mesh: ?Mesh;

  constructor(canvasViewBag: CanvasViewBag, brush: QuakeBrushInterface, group: Scene) {
    super(canvasViewBag);
    autoBind(this);

    this.brush = brush;
    this.mesh = null;
    this.group = group;
  }

  async loadTexture(): Promise<any> {
    return new Promise(resolve => {
      new THREE.TextureLoader().load("textures/texture-uv-1024x1024.png", texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(0.001, 0.001);

        resolve(texture);
      });
    });
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    // const vertices = this.brush.getVertices().map(quake2three);
    const material = new THREE.MeshLambertMaterial({
      // color: 0xffffff,
      map: await this.loadTexture(),
      // opacity: 0.6,
      // transparent: true,
    });

    const geometry = (new QuakeBrushGeometry(this.brush)).getGeometry();
    const mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;

    this.mesh = mesh;
    this.group.add(mesh);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const mesh = this.mesh;

    if (!mesh) {
      return;
    }

    disposeObject3D(mesh);
    this.group.remove(mesh);
  }
}
