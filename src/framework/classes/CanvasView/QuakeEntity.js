// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import Exception from "../Exception";
import { default as AmbientLightView } from "./AmbientLight";
import { default as AmbientSoundView } from "./AmbientSound";
import { default as MD2CharacterView } from "./MD2Character";
import { default as PointLightView } from "./PointLight";
import { default as QuakeBrushView } from "./QuakeBrush";

import type { AudioListener, AudioLoader, Group, LoadingManager as THREELoadingManager, Mesh, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeEntity as QuakeEntityInterface } from "../../interfaces/QuakeEntity";
import type { QueryBus } from "../../interfaces/QueryBus";

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
  +audioListener: AudioListener;
  +audioLoader: AudioLoader;
  +brushes: Group[];
  +entity: QuakeEntityInterface;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  cube: ?Mesh;
  material: ?Material;

  constructor(
    audioListener: AudioListener,
    audioLoader: AudioLoader,
    canvasViewBag: CanvasViewBag,
    entity: QuakeEntityInterface,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.brushes = [];
    this.entity = entity;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.material = null;
    this.queryBus = queryBus;
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
      const entityProperties = this.entity.getProperties();

      if (entityProperties.hasPropertyKey("light")) {
        const ambientLightBrightness = getBrightness(this);
        await this.loadingManager.blocking(
          this.canvasViewBag.add(cancelToken, new AmbientLightView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientLight")), this.scene, ambientLightBrightness)),
          "Loading world ambient light"
        );
      }
      if (entityProperties.hasPropertyKey("sounds")) {
        const ambientSoundSource: string = entityProperties.getPropertyByKey("sounds").getValue();
        await this.loadingManager.blocking(
          this.canvasViewBag.add(
            cancelToken,
            new AmbientSoundView(
              this.audioListener,
              this.audioLoader,
              this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientSound")),
              this.loadingManager,
              this.loggerBreadcrumbs.add("AmbientSound"),
              ambientSoundSource
            )
          ),
          "Loading world ambient sound"
        );
      }
    } else if (this.entity.isOfClass("info_player_start")) {
      let modelName = "chicken";
      const entityProperties = this.entity.getProperties();

      if (entityProperties.hasPropertyKey("model")) {
        modelName = entityProperties.getPropertyByKey("model").getValue();
      }
      await this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new MD2CharacterView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
            this.entity.getOrigin(),
            this.queryBus,
            this.scene,
            this.threeLoadingManager,
            `/assets/model-md2-${modelName}/`
          )
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
