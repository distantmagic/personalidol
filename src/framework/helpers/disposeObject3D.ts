import disposeMaterial from "./disposeMaterial";

import { Mesh, Object3D } from "three";

function doDispose(obj: Mesh | Object3D, disposeTextures: boolean): void {
  // @ts-ignore
  const geometry = obj.geometry;

  if (geometry) {
    geometry.dispose();
  }

  // @ts-ignore
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
