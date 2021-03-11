import type { ViewBaggableScene } from "@personalidol/framework/src/ViewBaggableScene.interface";

export interface MapScene extends ViewBaggableScene {
  readonly currentMap: string;
  readonly isMapScene: true;
}
