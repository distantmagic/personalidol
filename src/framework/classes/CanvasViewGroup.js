// @flow

import Cancelled from "./Exception/Cancelled";

import type { WebGLRenderer } from "three";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CanvasView } from "../interfaces/CanvasView";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../interfaces/CanvasViewGroup";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class CanvasViewGroup implements CanvasViewGroupInterface {
  +children: Array<CanvasView>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.children = [];
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(view: CanvasView): void {
    this.children.push(view);
  }

  async attach(cancelToken: CancelToken, renderer: WebGLRenderer): Promise<void> {
    return void (await Promise.all(
      this.children.map(child => {
        if (cancelToken.isCancelled()) {
          throw new Cancelled(
            this.loggerBreadcrumbs.add("attach"),
            "Cancel token was cancelled while attaching views group."
          );
        }

        return child.attach(cancelToken, renderer);
      })
    ));
  }

  async detach(cancelToken: CancelToken, renderer: WebGLRenderer): Promise<void> {
    return void (await Promise.all(
      this.children.map(child => {
        if (cancelToken.isCancelled()) {
          throw new Cancelled(
            this.loggerBreadcrumbs.add("detach"),
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
