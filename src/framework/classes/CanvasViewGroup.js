// @flow

import type { WebGLRenderer } from "three";

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

  async attach(renderer: WebGLRenderer): Promise<void> {
    await Promise.all(this.children.map(child => child.attach(renderer)));
  }

  async detach(renderer: WebGLRenderer): Promise<void> {
    await Promise.all(this.children.map(child => child.detach(renderer)));
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
