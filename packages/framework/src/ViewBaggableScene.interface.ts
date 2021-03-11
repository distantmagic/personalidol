import type { Scene } from "./Scene.interface";

export interface ViewBaggableScene extends Scene {
  readonly isViewBaggableScene: true;
}
