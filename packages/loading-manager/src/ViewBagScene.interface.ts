import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { ViewBag } from "./ViewBag.interface";

export interface ViewBagScene extends Scene {
  readonly scene: Scene;
  readonly viewBag: ViewBag;

  updatePreloadingState(): void;
}
