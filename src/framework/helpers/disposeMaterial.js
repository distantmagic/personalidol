// @flow

import disposeTexture from "./disposeTexture";

import type { Material } from "three";

export default function disposeMaterial(material: Material | $ReadOnlyArray<Material>, disposeTextures: boolean): void {
  if (Array.isArray(material)) {
    return void material.forEach(function(child) {
      return disposeMaterial(child, disposeTextures);
    });
  }

  // if (disposeTextures) {
  //   const texture = material.map;

  //   if (texture) {
  //     disposeTexture(texture);
  //   }
  // }

  material.dispose();
}
