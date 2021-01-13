import { disposableGeneric } from "./disposableGeneric";

import type { Material } from "three";

import type { DisposableCallback } from "./DisposableCallback.type";

export function disposableMaterial(materials: Material | Array<Material>): DisposableCallback {
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
