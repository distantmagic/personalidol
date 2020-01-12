import * as THREE from "three";

import disposeMaterial from "src/framework/helpers/disposeMaterial";

function doDispose(obj: THREE.Mesh | THREE.Object3D, disposeTextures: boolean): void {
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
export default function disposeObject3D(obj: THREE.Object3D, disposeTextures: boolean): void {
  return void obj.traverse(function(child) {
    return doDispose(child, disposeTextures);
  });
}
