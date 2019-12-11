// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import quake2three from "../../helpers/quake2three";
import { default as AmbientLightView } from "./AmbientLight";
import { default as AmbientSoundView } from "./AmbientSound";
import { default as MD2CharacterView } from "./MD2Character";
import { default as PointLightView } from "./PointLight";
import { default as QuakeBrushView } from "./QuakeBrush";
import { default as QuakeMapException } from "../Exception/QuakeMap";

import type { AudioListener, AudioLoader, Group, LoadingManager as THREELoadingManager, Mesh } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeEntity as QuakeEntityInterface } from "../../interfaces/QuakeEntity";
import type { QueryBus } from "../../interfaces/QueryBus";
import type { TextureLoader } from "../../interfaces/TextureLoader";

export default class QuakeEntity extends CanvasView {
  +audioListener: AudioListener;
  +audioLoader: AudioLoader;
  +brushes: Group[];
  +entity: QuakeEntityInterface;
  +group: Group;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +queryBus: QueryBus;
  +textureLoader: TextureLoader;
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
    group: Group,
    textureLoader: TextureLoader,
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
    this.group = group;
    this.textureLoader = textureLoader;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const brushes = this.entity.getBrushes();
    const brushesPromises = [];

    for (let brush of brushes) {
      // prettier-ignore
      brushesPromises.push(this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new QuakeBrushView(
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeBrush")),
            brush,
            this.group,
            this.textureLoader
          )
        ),
        "Loading entity brush"
      ));
    }

    await brushesPromises;

    const entityClassName = this.entity.getClassName();
    const entityProperties = this.entity.getProperties();

    switch (entityClassName) {
      case "info_player_start":
        const modelName = entityProperties.getPropertyByKey("model_name").getValue();

        await this.loadingManager.blocking(
          this.canvasViewBag.add(
            cancelToken,
            new MD2CharacterView(
              this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
              quake2three(this.entity.getOrigin()),
              this.queryBus,
              this.group,
              this.threeLoadingManager,
              `/models/model-md2-${modelName}/`
            )
          ),
          "Loading character"
        );
        break;
      case "light":
        await this.loadingManager.blocking(
          // prettier-ignore
          this.canvasViewBag.add(
            cancelToken,
            new PointLightView(
              this.canvasViewBag.fork(this.loggerBreadcrumbs.add("PointLight")),
              this.group,
              quake2three(this.entity.getOrigin()),
              entityProperties.getPropertyByKey("light").asNumber(),
              entityProperties.getPropertyByKey("decay").asNumber()
            )
          ),
          "Loading point light"
        );
        break;
      case "worldspawn":
        if (entityProperties.hasPropertyKey("light")) {
          // prettier-ignore
          await this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new AmbientLightView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientLight")),
                this.group,
                entityProperties.getPropertyByKey("light").asNumber()
              )
            ),
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
        break;
      default:
        throw new QuakeMapException(this.loggerBreadcrumbs.add("attach"), `Unsupported entity class name: "${entityClassName}"`);
    }
  }
}
