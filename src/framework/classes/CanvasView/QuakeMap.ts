import * as THREE from "three";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";

import CanvasView from "../CanvasView";
import JSONRPCClient from "../JSONRPCClient";
import { default as AmbientLightView } from "./AmbientLight";
import { default as AmbientSoundView } from "./AmbientSound";
import { default as GLTFModelView } from "./GLTFModel";
import { default as HemisphereLightView } from "./HemisphereLight";
import { default as MD2CharacterView } from "./MD2Character";
import { default as ParticlesView } from "./Particles";
import { default as PlayerView } from "./Player";
import { default as PointLightView } from "./PointLight";
import { default as QuakeBrushView } from "./QuakeBrush";
import { default as QuakeMapException } from "../Exception/QuakeMap";
import { default as SpotLightView } from "./SpotLight";

import { AudioListener, AudioLoader, LoadingManager as THREELoadingManager, Scene } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { JSONRPCClient as JSONRPCClientInterface } from "../../interfaces/JSONRPCClient";
import { LoadingManager } from "../../interfaces/LoadingManager";
import { Logger } from "../../interfaces/Logger";
import { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import { QuakeWorkerAny } from "../../types/QuakeWorkerAny";
import { QuakeWorkerGLTFModel } from "../../types/QuakeWorkerGLTFModel";
import { QuakeWorkerMD2Model } from "../../types/QuakeWorkerMD2Model";
import { QueryBus } from "../../interfaces/QueryBus";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
// eslint-disable-next-line import/no-webpack-loader-syntax
const QuakeMapWorker = require("../../../workers/loader?name=QuakeMapWorker!../../../workers/exports/QuakeMap");

export default class QuakeMap extends CanvasView {
  readonly audioListener: AudioListener;
  readonly audioLoader: AudioLoader;
  readonly loadingManager: LoadingManager;
  readonly logger: Logger;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly queryBus: QueryBus;
  readonly scene: Scene;
  readonly source: string;
  readonly threeLoadingManager: THREELoadingManager;
  private animationOffset: number;
  private quakeMapWorker: null | Worker = null;

  constructor(
    audioListener: AudioListener,
    audioLoader: AudioLoader,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus,
    scene: Scene,
    threeLoadingManager: THREELoadingManager,
    source: string
  ) {
    super(canvasViewBag);

    this.animationOffset = 0;
    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.scene = scene;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const quakeMapRpcClient = this.getQuakeMapRpcClient(cancelToken);

    const entities: Promise<void>[] = [];
    let gltfModels: QuakeWorkerGLTFModel[] = [];
    let md2Models: QuakeWorkerMD2Model[] = [];

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
                entity.light
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
                entity.light
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
                new THREE.Vector3().fromArray(entity.origin),
                new THREE.Color(parseInt(entity.color, 16)),
                entity.intensity,
                entity.decay,
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
                new THREE.Vector3().fromArray(entity.origin),
                new THREE.Color(parseInt(entity.color, 16)),
                entity.intensity,
                entity.decay,
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
                new THREE.Vector3().fromArray(entity.origin),
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
                entity.sounds
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
              new ParticlesView(this.canvasViewBag.fork(this.loggerBreadcrumbs.add("Particles")), this.children, new THREE.Vector3(...entity.origin))
            ),
            "Loading particles"
          ));
          break;
        default:
          throw new QuakeMapException(this.loggerBreadcrumbs.add("attach"), `Unsupported entity class name: "${entityClassName}"`);
      }
    }

    await Promise.all(entities);
    await Promise.all([this.attachGLTFEntities(cancelToken, gltfModels), this.attachMD2Entities(cancelToken, md2Models)]);

    this.scene.add(this.children);
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
            new THREE.Vector3().fromArray(entity.origin),
            this.queryBus,
            this.children,
            this.threeLoadingManager,
            `/models/model-md2-${entity.model_name}/`,
            entity.angle,
            this.animationOffset,
            entity.skin
          )
        ),
        "Loading MD2 model"
      ));
    }

    await Promise.all(md2ModelsViews);
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.scene.remove(this.children);

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
