import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import { default as ICursorCanvasView } from "src/framework/interfaces/CanvasView/Cursor";

const CURSOR_WIDTH = 32;
const CURSOR_HEIGHT = Math.round(CURSOR_WIDTH * 1.6);

export default class Cursor extends CanvasView implements ICursorCanvasView {
  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const geometry = new THREE.BoxBufferGeometry(CURSOR_WIDTH - 8, CURSOR_HEIGHT - 8, CURSOR_WIDTH - 8);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      // depthTest: false
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.children.add(mesh);

    const wireframeGeometry = new THREE.BoxBufferGeometry(CURSOR_WIDTH, CURSOR_HEIGHT, CURSOR_WIDTH);
    const wireframe = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      depthTest: false,
      wireframe: true,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframe);

    wireframeMesh.castShadow = false;
    wireframeMesh.receiveShadow = false;

    wireframeMesh.renderOrder = 1000;

    this.children.add(wireframeMesh);
  }

  getName(): "Cursor" {
    return "Cursor";
  }

  setPosition(position: THREE.Vector3): void {
    this.children.position.set(position.x, position.y + CURSOR_HEIGHT / 2, position.z);
  }
}
