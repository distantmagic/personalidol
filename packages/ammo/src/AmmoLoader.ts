/// <reference types="@types/ammo.js" />

// @ts-ignore there are no types for this loader
import AmmoWASM from "ammo.js/builds/ammo.wasm";

import { must } from "@personalidol/framework/src/must";

import type { AmmoLoader as IAmmoLoader } from "./AmmoLoader.interface";

export function AmmoLoader(filename: string): IAmmoLoader {
  function _locateFile(): string {
    return filename;
  }

  async function loadWASM(): Promise<typeof Ammo> {
    // Ammojs tries to assign properties to the global context, which is not
    // available in modules.
    const context: {
      Ammo: null | typeof Ammo;
    } = {
      Ammo: null,
    };

    await AmmoWASM.call(context, {
      locateFile: _locateFile,
    });

    return must(context.Ammo, "Unable to create AMMO.js instance.");
  }

  return Object.freeze({
    loadWASM: loadWASM,
  });
}
