// @flow

import disposeMaterial from "./disposeMaterial";

import type { Object3D } from "three";

function doDispose(obj: Object3D, disposeTextures: boolean): void {
  const geometry = obj.geometry;

  if (geometry) {
    geometry.dispose();
  }

  const material = obj.material;

  if (material) {
    disposeMaterial(material, disposeTextures);
  }
}

/**
 * See: https://github.com/Marco-Sulla/my3
 */
export default function disposeObject3D(obj: Object3D, disposeTextures: boolean): void {
  return void obj.traverse(function(child) {
    return doDispose(child, disposeTextures);
  });
}
