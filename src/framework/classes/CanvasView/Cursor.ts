import * as THREE from "three";

import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import { default as ICursorCanvasView } from "src/framework/interfaces/CanvasView/Cursor";

const CURSOR_WIDTH = 16;
const CURSOR_HEIGHT = 16;

export default class Cursor extends CanvasView implements ICursorCanvasView {
  private isPointerDown: boolean = false;
  private position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const geometry = new THREE.BoxBufferGeometry(CURSOR_WIDTH, CURSOR_HEIGHT, CURSOR_WIDTH);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // depthTest: false
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.children.add(mesh);
  }

  getCursorPositionY(): number {
    if (this.isPointerDown) {
      return this.position.y + 0.5 * CURSOR_HEIGHT;
    }

    return this.position.y + 1.6 * CURSOR_HEIGHT;
  }

  getName(): "Cursor" {
    return "Cursor";
  }

  setPointerDown(): void {
    this.isPointerDown = true;
    this.updateMesh();
  }

  setPointerUp(): void {
    this.isPointerDown = false;
    this.updateMesh();
  }

  setPosition(position: THREE.Vector3): void {
    this.position = position;
    this.updateMesh();
  }

  updateMesh(): void {
    const position = this.position;

    this.children.position.set(position.x, this.getCursorPositionY(), position.z);
  }
}
