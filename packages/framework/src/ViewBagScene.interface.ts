import type { PollablePreloadingState } from "./PollablePreloadingState.interface";
import type { Scene } from "./Scene.interface";
import type { ViewBag } from "./ViewBag.interface";
import type { ViewBaggableScene } from "./ViewBaggableScene.interface";

export interface ViewBagScene extends PollablePreloadingState, Scene {
  readonly isViewBagScene: true;
  readonly scene: ViewBaggableScene;
  readonly viewBag: ViewBag;
}
