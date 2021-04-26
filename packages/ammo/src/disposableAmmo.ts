/// <reference types="@types/ammo.js" />

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";

export function disposableAmmo(ammo: typeof Ammo, ammoObject: Ammo.Type): DisposableCallback {
  return function () {
    ammo.destroy(ammoObject);
  };
}
