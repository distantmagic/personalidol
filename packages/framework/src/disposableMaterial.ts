import { disposableGeneric } from "./disposableGeneric";

import type { Material } from "three";

import type { Disposable } from "./Disposable.type";

export function disposableMaterial(materials: Material | Array<Material>): Disposable {
  if (!Array.isArray(materials)) {
    return disposableGeneric(materials);
  }

  const disposables = materials.map(disposableGeneric);

  return function () {
    for (let disposable of disposables) {
      disposable();
    }
  };
}
