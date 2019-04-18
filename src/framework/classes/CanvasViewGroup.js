// @flow

import Cancelled from "./Exception/Cancelled";

import type { WebGLRenderer } from "three";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../interfaces/CanvasViewGroup";

export default class CanvasViewGroup implements CanvasViewGroupInterface {
  +children: Array<CanvasView>;

  constructor() {
    this.children = [];
  }

  add(view: CanvasView): void {
    this.children.push(view);
  }

  async attach(
    cancelToken: CancelToken,
    renderer: WebGLRenderer
  ): Promise<void> {
    return void (await Promise.all(
      this.children.map(function(child) {
        if (cancelToken.isCancelled()) {
          throw new Cancelled(
            "Cancel token was cancelled while attaching views group."
          );
        }

        return child.attach(cancelToken, renderer);
      })
    ));
  }

  async detach(
    cancelToken: CancelToken,
    renderer: WebGLRenderer
  ): Promise<void> {
    return void (await Promise.all(
      this.children.map(function(child) {
        if (cancelToken.isCancelled()) {
          throw new Cancelled(
            "Cancel token was cancelled while detaching views group."
          );
        }

        return child.detach(cancelToken, renderer);
      })
    ));
  }

  async start(): Promise<void> {
    await Promise.all(this.children.map(child => child.start()));
  }

  async stop(): Promise<void> {
    await Promise.all(this.children.map(child => child.stop()));
  }

  begin(): void {
    for (let child of this.children) {
      child.begin();
    }
  }

  update(delta: number): void {
    for (let child of this.children) {
      child.update(delta);
    }
  }
}
