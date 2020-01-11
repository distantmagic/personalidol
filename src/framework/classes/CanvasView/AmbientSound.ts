// @flow strict

import * as THREE from "three";

import Canceled from "../Exception/CancelToken/Canceled";
import CanvasView from "../CanvasView";

import type { Audio, AudioListener, AudioLoader } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { LoadingManager } from "../../interfaces/LoadingManager";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";

export default class AmbientSound extends CanvasView {
  +audioListener: AudioListener;
  +audioLoader: AudioLoader;
  +loadingManager: LoadingManager;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +source: string;
  sound: ?Audio;

  constructor(
    audioListener: AudioListener,
    audioLoader: AudioLoader,
    canvasViewBag: CanvasViewBag,
    loadingManager: LoadingManager,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    source: string
  ) {
    super(canvasViewBag);

    this.audioListener = audioListener;
    this.audioLoader = audioLoader;
    this.loadingManager = loadingManager;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.sound = null;
    this.source = source;
  }

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

            resolve();
          },
          null,
          reject
        );
      }),
      "Loading ambient audio track"
    );
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const sound = this.sound;

    if (!sound) {
      return;
    }

    sound.stop();
  }
}
