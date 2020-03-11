import * as THREE from "three";

import Canceled from "src/framework/classes/Exception/CancelToken/Canceled";
import CanvasView from "src/framework/classes/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoadingManager from "src/framework/interfaces/LoadingManager";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import QuakeWorkerSounds from "src/framework/types/QuakeWorkerSounds";

export default class AmbientSound extends CanvasView {
  readonly audioListener: THREE.AudioListener;
  readonly audioLoader: THREE.AudioLoader;
  readonly loadingManager: LoadingManager;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly source: string;
  private sound: null | THREE.Audio;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    audioListener: THREE.AudioListener,
    audioLoader: THREE.AudioLoader,
    loadingManager: LoadingManager,
    entity: QuakeWorkerSounds
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.sound = null;
    this.source = entity.sounds;
  }

  @cancelable(true)
  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    return this.loadingManager.blocking(
      new Promise((resolve, reject) => {
        this.audioLoader.load(
          this.source,
          buffer => {
            if (cancelToken.isCanceled()) {
              return void reject(new Canceled(this.loggerBreadcrumbs.add("attach"), "Audio loading was canceled."));
            }

            const sound = new THREE.Audio(this.audioListener);

            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(1);
            sound.play();

            this.sound = sound;

            return void resolve();
          },
          undefined,
          reject
        );
      }),
      "Loading ambient audio track"
    );
  }

  @cancelable()
  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const sound = this.sound;

    if (!sound) {
      return;
    }

    sound.stop();
  }

  getName(): "AmbientSound" {
    return "AmbientSound";
  }
}
