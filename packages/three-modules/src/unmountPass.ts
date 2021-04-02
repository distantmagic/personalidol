import type { GenericCallback } from "@personalidol/framework/src/GenericCallback.type";

import type { EffectComposer } from "./postprocessing/EffectComposer.interface";
import type { Pass } from "./postprocessing/Pass.interface";

export function unmountPass(effectComposer: EffectComposer, pass: Pass): GenericCallback {
  return function () {
    effectComposer.removePass(pass);
  };
}
