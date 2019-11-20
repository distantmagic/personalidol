// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import Exception from "../Exception";
import { default as AmbientLightView } from "./AmbientLight";
import { default as MD2CharacterView } from "./MD2Character";
import { default as PointLightView } from "./PointLight";
import { default as QuakeBrushView } from "./QuakeBrush";

import type { Group, LoadingManager as THREELoadingManager, Mesh, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeEntity as QuakeEntityInterface } from "../../interfaces/QuakeEntity";

function getBrightness(self: QuakeEntity): number {
  const brightness = Number(
    self.entity
      .getProperties()
      .getPropertyByKey("light")
      .getValue()
  );

  if (isNaN(brightness)) {
    throw new Exception(self.loggerBreadcrumbs.add("attach"), "Light brightness is not a number.");
  }

  return brightness / 255;
}

export default class QuakeEntity extends CanvasView {
  +brushes: Group[];
  +entity: QuakeEntityInterface;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  cube: ?Mesh;
  material: ?Material;

  constructor(
    canvasViewBag: CanvasViewBag,
    entity: QuakeEntityInterface,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: Scene,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.brushes = [];
    this.entity = entity;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.material = null;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const brushes = this.entity.getBrushes();

    for (let brush of brushes) {
      await this.loadingManager.blocking(
        this.canvasViewBag.add(cancelToken, new QuakeBrushView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeBrush")), brush, this.scene)),
        "Loading entity brush"
      );
    }

    if (this.entity.isOfClass("worldspawn")) {
      if (this.entity.getProperties().hasPropertyKey("light")) {
        const ambientLightBrightness = getBrightness(this);
        await this.loadingManager.blocking(
          this.canvasViewBag.add(cancelToken, new AmbientLightView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientLight")), this.scene, ambientLightBrightness)),
          "Loading world ambient light"
        );
      }
    } else if (this.entity.isOfClass("info_player_start")) {
      await this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new MD2CharacterView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")), this.entity.getOrigin(), this.scene, this.threeLoadingManager)
        ),
        "Loading character"
      );
    } else if (this.entity.isOfClass("light")) {
      const brightness = getBrightness(this);

      await this.loadingManager.blocking(
        this.canvasViewBag.add(cancelToken, new PointLightView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("PointLight")), this.scene, this.entity.getOrigin(), brightness)),
        "Loading point light"
      );
    }
  }
}
