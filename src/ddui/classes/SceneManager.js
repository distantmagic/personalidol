// @flow

import frameinterval from "../../framework/helpers/frameinterval";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { SceneController } from "../interfaces/SceneController";

export default class SceneManager<T> {
  cancelToken: CancelToken;
  controller: SceneController<T>;
  canvasHeight: number;
  canvasWidth: number;

  constructor(cancelToken: CancelToken, controller: SceneController<T>) {
    this.cancelToken = cancelToken;
    this.controller = controller;
  }

  async attach(canvas: T): Promise<void> {
    await this.controller.init(canvas);

    for await (let tick of frameinterval()) {
      await this.controller.tick(canvas, tick);
      // break;
    }
  }

  async detach(canvas: T): Promise<void> {
    await this.controller.destroy(canvas);
  }
}
