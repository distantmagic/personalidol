import type { Unmountable } from "@personalidol/framework/src/Unmountable.type";

import type { EffectComposer } from "./postprocessing/EffectComposer.interface";
import type { Pass } from "./postprocessing/Pass.interface";

export function unmountPass(effectComposer: EffectComposer, pass: Pass): Unmountable {
  return function () {
    effectComposer.removePass(pass);
  };
}
