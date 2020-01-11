import disposeTexture from "./disposeTexture";

import { Material } from "three";

function doDisposeMaterial<T extends Material>(material: T, disposeTextures: boolean): void {
  if (disposeTextures) {
    // @ts-ignore
    const texture = material.map;

    if (texture) {
      disposeTexture(texture);
    }
  }

  material.dispose();
}

export default function disposeMaterial<T extends Material>(material: T | ReadonlyArray<T>, disposeTextures: boolean): void {
  if (Array.isArray(material)) {
    return void material.forEach(function(child) {
      return doDisposeMaterial(child, disposeTextures);
    });
  }

  doDisposeMaterial(material as Material, disposeTextures);
}
