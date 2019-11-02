// @flow

import type { CanvasController as CanvasControllerInterface } from "../interfaces/CanvasController";

export default class CanvasController implements CanvasControllerInterface {
  draw(interpolationPercentage: number): void {}
}
