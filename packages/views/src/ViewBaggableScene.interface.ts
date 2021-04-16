import type { Scene } from "@personalidol/framework/src/Scene.interface";

export interface ViewBaggableScene extends Scene {
  readonly isViewBaggableScene: true;
}
