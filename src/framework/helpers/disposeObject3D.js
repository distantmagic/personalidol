// @flow

import disposeTexture from "./disposeTexture";

import type { Object3D } from "three";

function doDispose(obj: Object3D): void {
  const geometry = obj.geometry;

  if (geometry) {
    geometry.dispose();
  }

  const material = obj.material;

  if (!material) {
    return;
  }

  const texture = material.map;

  if (texture) {
    disposeTexture(texture);
  }

  material.dispose();
}

/**
 * See: https://github.com/Marco-Sulla/my3
 */
export default function disposeObject3D(obj: Object3D): void {
  return void obj.traverse(doDispose);
}
