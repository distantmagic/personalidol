// @flow

import frameinterval from "../../framework/helpers/frameinterval";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasController } from "../interfaces/CanvasController";

export default class SceneManager<T> {
  +cancelToken: CancelToken;
  +controller: CanvasController<T>;

  constructor(cancelToken: CancelToken, controller: CanvasController<T>) {
    this.cancelToken = cancelToken;
    this.controller = controller;
  }

  async attach(canvas: T): Promise<void> {
    await this.controller.init(canvas);

    for await (let tick of frameinterval(this.cancelToken)) {
      if (this.controller.isInitialized()) {
        await this.controller.tick(canvas, tick);
      }
    }
  }

  async detach(canvas: T): Promise<void> {
    await this.controller.destroy(canvas);
  }
}
