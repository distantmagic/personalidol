import * as THREE from "three";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";

import CanvasView from "src/framework/classes/CanvasView";
import JSONRPCClient from "src/framework/classes/JSONRPCClient";
import { default as AmbientLightView } from "src/framework/classes/CanvasView/AmbientLight";
import { default as AmbientSoundView } from "src/framework/classes/CanvasView/AmbientSound";
import { default as GLTFModelView } from "src/framework/classes/CanvasView/GLTFModel";
import { default as HemisphereLightView } from "src/framework/classes/CanvasView/HemisphereLight";
import { default as MD2CharacterView } from "src/framework/classes/CanvasView/MD2Character";
import { default as ParticlesView } from "src/framework/classes/CanvasView/Particles";
import { default as PlayerView } from "src/framework/classes/CanvasView/Player";
import { default as PointLightView } from "src/framework/classes/CanvasView/PointLight";
import { default as QuakeBrushView } from "src/framework/classes/CanvasView/QuakeBrush";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";
import { default as SpotLightView } from "src/framework/classes/CanvasView/SpotLight";

import { CancelToken } from "src/framework/interfaces/CancelToken";
import { CanvasViewBag } from "src/framework/interfaces/CanvasViewBag";
import { JSONRPCClient as JSONRPCClientInterface } from "src/framework/interfaces/JSONRPCClient";
import { LoadingManager } from "src/framework/interfaces/LoadingManager";
import { Logger } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QuakeWorkerAny } from "src/framework/types/QuakeWorkerAny";
import { QuakeWorkerGLTFModel } from "src/framework/types/QuakeWorkerGLTFModel";
import { QuakeWorkerMD2Model } from "src/framework/types/QuakeWorkerMD2Model";
import { QueryBus } from "src/framework/interfaces/QueryBus";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
// eslint-disable-next-line import/no-webpack-loader-syntax
const QuakeMapWorker = require("../../../workers/loader?name=QuakeMapWorker!src/workers/modules/quakeMap");

export default class QuakeMap extends CanvasView {
  readonly audioListener: THREE.AudioListener;
  readonly audioLoader: THREE.AudioLoader;
  readonly loadingManager: LoadingManager;
  readonly logger: Logger;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly queryBus: QueryBus;
  readonly source: string;
  readonly threeLoadingManager: THREE.LoadingManager;
  private animationOffset: number;
  private quakeMapWorker: null | Worker = null;

  constructor(
    audioListener: THREE.AudioListener,
    audioLoader: THREE.AudioLoader,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    group: THREE.Group,
    threeLoadingManager: THREE.LoadingManager,
    source: string
  ) {
    super(canvasViewBag, group);

    this.animationOffset = 0;
    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const quakeMapRpcClient = this.getQuakeMapRpcClient(cancelToken);

    const entities: Promise<void>[] = [];
    const gltfModels: QuakeWorkerGLTFModel[] = [];
    const md2Models: QuakeWorkerMD2Model[] = [];

    for await (let entity of quakeMapRpcClient.requestGenerator<QuakeWorkerAny>(cancelToken, "/map", [this.source])) {
      const entityClassName = entity.classname;

      if ("string" !== typeof entityClassName) {
        throw new QuakeMapException(this.loggerBreadcrumbs.add("attach"), `Entity class name is not a string."`);
      }

      switch (entity.classname) {
        case "func_group":
        case "worldspawn":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new QuakeBrushView(
                this.loggerBreadcrumbs.add("QuakeBrush"),
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("QuakeBrush")),
                entity,
                this.children,
                this.queryBus,
                this.threeLoadingManager
              )
            ),
            "Loading entity brush"
          ));
          break;
        case "light_ambient":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new AmbientLightView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientLight")),
                this.children,
                entity
              )
            ),
            "Loading world ambient light"
          ));
          break;
        case "light_hemisphere":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new HemisphereLightView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("HemisphereLight")),
                this.children,
                entity
              )
            ),
            "Loading world hemisphere light"
          ));
          break;
        case "light_point":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new PointLightView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("PointLight")),
                this.children,
                entity
              )
            ),
            "Loading point light"
          ));
          break;
        case "light_spotlight":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new SpotLightView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("SpotLight")),
                this.children,
                entity,
              )
            ),
            "Loading spotlight"
          ));
          break;
        case "model_gltf":
          gltfModels.push(entity);
          break;
        case "model_md2":
          md2Models.push(entity);
          break;
        case "player":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new PlayerView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("Player")),
                this.children,
                entity
              )
            ),
            "Loading world ambient sound"
          ));
          break;
        case "sounds":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new AmbientSoundView(
                this.audioListener,
                this.audioLoader,
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientSound")),
                this.loadingManager,
                this.loggerBreadcrumbs.add("AmbientSound"),
                this.children,
                entity
              )
            ),
            "Loading world ambient sound"
          ));
          break;
        case "spark_particles":
          // prettier-ignore
          entities.push(this.loadingManager.blocking(
            this.canvasViewBag.add(
              cancelToken,
              new ParticlesView(
                this.canvasViewBag.fork(this.loggerBreadcrumbs.add("Particles")),
                this.children,
                entity
               )
            ),
            "Loading particles"
          ));
          break;
        default:
          throw new QuakeMapException(this.loggerBreadcrumbs.add("attach"), `Unsupported entity class name: "${entityClassName}"`);
      }
    }

    await Promise.all(entities);

    // prettier-ignore
    await Promise.all([
      this.attachGLTFEntities(cancelToken, gltfModels),
      this.attachMD2Entities(cancelToken, md2Models)
    ]);
  }

  async attachGLTFEntities(cancelToken: CancelToken, gltfModels: Array<QuakeWorkerGLTFModel>): Promise<void> {
    const gltfByModel = groupBy(gltfModels, "model_name");
    const gltfModelsViews = [];

    for (let entity of uniqBy(gltfModels, "model_name")) {
      this.animationOffset += 200;

      const gltfByTexture = groupBy(gltfByModel[entity.model_name], "model_texture");

      for (let textureName of Object.keys(gltfByTexture)) {
        // prettier-ignore
        gltfModelsViews.push(this.loadingManager.blocking(
          this.canvasViewBag.add(
            cancelToken,
            new GLTFModelView(
              this.loggerBreadcrumbs.add("GLTFModel"),
              this.canvasViewBag.fork(this.loggerBreadcrumbs.add("GLTFModel")),
              this.queryBus,
              this.children,
              this.threeLoadingManager,
              `/models/model-glb-${entity.model_name}/`,
              textureName,
              this.animationOffset,
              gltfByTexture[textureName]
            )
          ),
          "Loading GLTF model"
        ));
      }
    }

    await Promise.all(gltfModelsViews);
  }

  async attachMD2Entities(cancelToken: CancelToken, md2Models: Array<QuakeWorkerMD2Model>): Promise<void> {
    const md2ModelsViews = [];

    for (let entity of md2Models) {
      this.animationOffset += 200;

      // prettier-ignore
      md2ModelsViews.push(this.loadingManager.blocking(
        this.canvasViewBag.add(
          cancelToken,
          new MD2CharacterView(
            this.loggerBreadcrumbs.add("MD2Character"),
            this.canvasViewBag.fork(this.loggerBreadcrumbs.add("MD2Character")),
            this.queryBus,
            this.children,
            this.threeLoadingManager,
            `/models/model-md2-${entity.model_name}/`,
            this.animationOffset,
            entity,
          )
        ),
        "Loading MD2 model"
      ));
    }

    await Promise.all(md2ModelsViews);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const quakeMapWorker = this.quakeMapWorker;

    if (quakeMapWorker) {
      quakeMapWorker.terminate();
    }
  }

  getQuakeMapRpcClient(cancelToken: CancelToken): JSONRPCClientInterface {
    const quakeMapWorker: Worker = new QuakeMapWorker();
    const quakeMapRpcClient = JSONRPCClient.attachTo(this.loggerBreadcrumbs.add("JSONRPCClient"), cancelToken, quakeMapWorker);

    this.quakeMapWorker = quakeMapWorker;

    return quakeMapRpcClient;
  }
}
