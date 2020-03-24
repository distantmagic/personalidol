import * as THREE from "three";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";

import CanvasView from "src/framework/classes/CanvasView";
import { default as AmbientLightView } from "src/framework/classes/CanvasView/AmbientLight";
import { default as AmbientSoundView } from "src/framework/classes/CanvasView/AmbientSound";
import { default as GLTFModelView } from "src/framework/classes/CanvasView/GLTFModel";
import { default as HemisphereLightView } from "src/framework/classes/CanvasView/HemisphereLight";
import { default as MD2CharacterView } from "src/framework/classes/CanvasView/MD2Character";
import { default as ParticlesView } from "src/framework/classes/CanvasView/Particles";
import { default as PlayerController } from "src/framework/classes/CanvasController/Player";
import { default as PointLightView } from "src/framework/classes/CanvasView/PointLight";
import { default as QuakeBrushView } from "src/framework/classes/CanvasView/QuakeBrush";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";
import { default as SpotLightView } from "src/framework/classes/CanvasView/SpotLight";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasControllerBus from "src/framework/interfaces/CanvasControllerBus";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoadingManager from "src/framework/interfaces/LoadingManager";
import type Logger from "src/framework/interfaces/Logger";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PointerState from "src/framework/interfaces/PointerState";
import type QueryBus from "src/framework/interfaces/QueryBus";
import type { default as IPerspectiveCameraController } from "src/framework/interfaces/CanvasController/PerspectiveCamera";
import type { default as IPointerController } from "src/framework/interfaces/CanvasController/Pointer";

import type QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import type QuakeWorkerGLTFModel from "src/framework/types/QuakeWorkerGLTFModel";
import type QuakeWorkerMD2Model from "src/framework/types/QuakeWorkerMD2Model";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
/* eslint-disable import/no-webpack-loader-syntax */
const QuakeMapWorker = require("../../../workers/loader?name=QuakeMapWorker!src/workers/modules/map");
const PhysicsWorker = require("../../../workers/loader?name=PhysicsWorker!src/workers/modules/physics");
/* eslint-enable import/no-webpack-loader-syntax */

function disposeQuakeMapWorker(self: QuakeMap): void {
  const quakeMapWorker = self.quakeMapWorker;

  if (quakeMapWorker) {
    quakeMapWorker.terminate();
    self.quakeMapWorker = null;
  }
}

export default class QuakeMap extends CanvasView {
  readonly audioListener: THREE.AudioListener;
  readonly audioLoader: THREE.AudioLoader;
  readonly gameCameraController: IPerspectiveCameraController;
  readonly canvasControllerBus: CanvasControllerBus;
  readonly loadingManager: LoadingManager;
  readonly logger: Logger;
  readonly pointerController: IPointerController;
  readonly pointerState: PointerState;
  readonly queryBus: QueryBus;
  readonly source: string;
  readonly threeLoadingManager: THREE.LoadingManager;
  private animationOffset: number;
  physicsWorker: null | Worker = null;
  quakeMapWorker: null | Worker = null;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    gameCameraController: IPerspectiveCameraController,
    canvasControllerBus: CanvasControllerBus,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    audioListener: THREE.AudioListener,
    audioLoader: THREE.AudioLoader,
    loadingManager: LoadingManager,
    logger: Logger,
    pointerController: IPointerController,
    pointerState: PointerState,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager,
    source: string
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.animationOffset = 0;
    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.gameCameraController = gameCameraController;
    this.canvasControllerBus = canvasControllerBus;
    this.loadingManager = loadingManager;
    this.logger = logger;
    this.pointerController = pointerController;
    this.pointerState = pointerState;
    this.queryBus = queryBus;
    this.source = source;
    this.threeLoadingManager = threeLoadingManager;
  }

  @cancelable()
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const messageChannel = new MessageChannel();

    const physicsWorker: Worker = new PhysicsWorker();

    physicsWorker.postMessage(messageChannel.port1, [messageChannel.port1]);

    this.physicsWorker = physicsWorker;

    const quakeMapWorker: Worker = new QuakeMapWorker();

    this.quakeMapWorker = quakeMapWorker;

    const entities: Promise<void>[] = [];
    const gltfModels: QuakeWorkerGLTFModel[] = [];
    const md2Models: QuakeWorkerMD2Model[] = [];

    await new Promise((resolve) => {
      quakeMapWorker.onmessage = (evt: MessageEvent) => {
        const entity: null | QuakeWorkerAny = evt.data;

        // means it's done
        if (!entity) {
          disposeQuakeMapWorker(this);

          return void resolve();
        }

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
                  this.children,
                  entity,
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
                  this.loggerBreadcrumbs.add("AmbientLight"),
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
                  this.loggerBreadcrumbs.add("HemisphereLight"),
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
                  this.loggerBreadcrumbs.add("PointLight"),
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
                  this.loggerBreadcrumbs.add("SpotLight"),
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
              this.canvasControllerBus.add(
                cancelToken,
                new PlayerController(
                  this.loggerBreadcrumbs.add("Player"),
                  this.gameCameraController,
                  this.canvasViewBag.fork(this.loggerBreadcrumbs.add("Player")),
                  this.children,
                  entity,
                  this.loadingManager,
                  this.pointerController,
                  this.pointerState,
                  this.queryBus,
                  this.threeLoadingManager
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
                  this.loggerBreadcrumbs.add("AmbientSound"),
                  this.canvasViewBag.fork(this.loggerBreadcrumbs.add("AmbientSound")),
                  this.children,
                  this.audioListener,
                  this.audioLoader,
                  this.loadingManager,
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
                  this.loggerBreadcrumbs.add("Particles"),
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

        return void 0;
      };

      quakeMapWorker.postMessage(
        {
          physicsMessagePort: messageChannel.port2,
          source: this.source,
        },
        [messageChannel.port2]
      );
    });

    await Promise.all(entities);

    // prettier-ignore
    await Promise.all([
      this.attachGLTFEntities(cancelToken, gltfModels),
      this.attachMD2Entities(cancelToken, md2Models)
    ]);
  }

  @cancelable()
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
              this.children,
              this.queryBus,
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

  @cancelable()
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
            this.children,
            this.queryBus,
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

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const physicsWorker = this.physicsWorker;

    if (physicsWorker) {
      physicsWorker.terminate();
    }

    disposeQuakeMapWorker(this);
  }

  getName(): "QuakeMap" {
    return "QuakeMap";
  }
}
