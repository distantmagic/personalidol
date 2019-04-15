// @flow

import type {
  BeginCallback,
  DrawCallback,
  EndCallback,
  UpdateCallback
} from "mainloop.js";

export interface Scheduler {
  notifyBegin(): void;

  notifyDraw(interpolationPercentage: number): void;

  notifyEnd(fps: number, isPanicked: boolean): void;

  notifyUpdate(delta: number): void;

  offBegin(BeginCallback): void;

  offDraw(DrawCallback): void;

  offEnd(EndCallback): void;

  offUpdate(UpdateCallback): void;

  onBegin(BeginCallback): void;

  onDraw(DrawCallback): void;

  onEnd(EndCallback): void;

  onUpdate(UpdateCallback): void;
}
