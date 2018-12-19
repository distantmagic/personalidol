// @flow

import EventEmitter from "eventemitter3";

import CancelToken from "./CancelToken";

import type { Cancelled } from "../interfaces/Exception/Cancelled";
import type { Scene as SceneInterface } from "../interfaces/Scene";
import type { SceneState } from "../interfaces/SceneState";

export default class Scene<T: SceneState> implements SceneInterface {
  eventEmitter: EventEmitter;
  sceneState: ?T;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  awaitStateUpdate(cancelToken: CancelToken): Promise<T> {
    return new Promise((resolve, reject) => {
      const resolver = sceneState => resolve(sceneState);

      cancelToken.onCancel((cancelled: Cancelled) => {
        this.eventEmitter.off("status.update", resolver);
        reject(cancelled);
      });

      return this.eventEmitter.once("state.update", resolver);
    });
  }

  async *awaitStateUpdates(
    cancelToken: CancelToken
  ): AsyncGenerator<T, void, void> {
    if (this.sceneState) {
      yield this.sceneState;
    }

    while (true) {
      yield await this.awaitStateUpdate(cancelToken);
    }
  }

  setSceneState(sceneState: T): void {
    this.sceneState = sceneState;
    this.eventEmitter.emit("state.update", sceneState);
  }
}
