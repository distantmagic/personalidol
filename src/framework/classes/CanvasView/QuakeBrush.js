// @flow

import * as THREE from "three";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import QuakeBrushGeometry from "../QuakeBrushGeometry";

import type { Group, Mesh } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QuakeBrush as QuakeBrushInterface } from "../../interfaces/QuakeBrush";
import type { QuakeMapTextureLoader } from "../../interfaces/QuakeMapTextureLoader";

export default class QuakeBrush extends CanvasView {
  +brush: QuakeBrushInterface;
  +group: Group;
  +textureLoader: QuakeMapTextureLoader;
  mesh: ?Mesh;

  constructor(canvasViewBag: CanvasViewBag, brush: QuakeBrushInterface, group: Group, textureLoader: QuakeMapTextureLoader) {
    super(canvasViewBag);

    this.brush = brush;
    this.mesh = null;
    this.group = group;
    this.textureLoader = textureLoader;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const textures = this.brush.getTextures();

    for (let texture of textures) {
      if ("__TB_empty" !== texture) {
        this.textureLoader.registerTexture(texture, `${texture}.png`);
      }
    }

    const loadedTextures = await this.textureLoader.loadTextures(cancelToken, textures);
    const quakeBrushGeometry = new QuakeBrushGeometry(this.brush);
    const geometry = quakeBrushGeometry.getGeometry(loadedTextures);
    const materials = loadedTextures.map(texture => {
      return new THREE.MeshLambertMaterial({
        map: texture,
      });
    });

    const mesh = new THREE.Mesh(
      geometry,
      // do not use array as it triggers multi-material
      materials.length > 1 ? materials : materials[0]
    );

    mesh.castShadow = true;
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

    disposeObject3D(mesh, false);
    this.group.remove(mesh);
  }
}
