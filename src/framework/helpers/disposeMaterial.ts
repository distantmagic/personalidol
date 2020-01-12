import * as THREE from "three";

import disposeTexture from "./disposeTexture";

function doDisposeMaterial<T extends THREE.Material>(material: T, disposeTextures: boolean): void {
  if (disposeTextures) {
    // @ts-ignore
    const texture = material.map;

    if (texture) {
      disposeTexture(texture);
    }
  }

  material.dispose();
}

export default function disposeMaterial<T extends THREE.Material>(material: T | ReadonlyArray<T>, disposeTextures: boolean): void {
  if (Array.isArray(material)) {
    return void material.forEach(function(child) {
      return doDisposeMaterial(child, disposeTextures);
    });
  }

  doDisposeMaterial(material as THREE.Material, disposeTextures);
}
