import { Mesh } from "three/src/objects/Mesh";
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry";

import type { Material } from "three/src/materials/Material";
import type { Mesh as IMesh } from "three/src/objects/Mesh";
import type { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new PlaneBufferGeometry(2, 2);

// Helper for passes that need to fill the viewport with a single quad.

export class FullScreenQuad {
  private _mesh: IMesh;

  get material() {
    return this._mesh.material;
  }

  set material(value: Material | Material[]) {
    this._mesh.material = value;
  }

  constructor(material: Material | Material[]) {
    this._mesh = new Mesh(geometry, material);
  }

  dispose() {
    this._mesh.geometry.dispose();
  }

  render(renderer: WebGLRenderer) {
    renderer.render(this._mesh, camera);
  }
}
