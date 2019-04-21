// @flow

import type { TiledMapObjectElementChecker as TiledMapObjectElementCheckerInterface } from "../interfaces/TiledMapObjectElementChecker";

export default class TiledMapObjectElementChecker
  implements TiledMapObjectElementCheckerInterface {
  +objectElement: HTMLElement;

  constructor(objectElement: HTMLElement) {
    this.objectElement = objectElement;
  }

  isEllipse(): boolean {
    return !!this.objectElement.querySelector("ellipse");
  }

  isPolygon(): boolean {
    return !!this.objectElement.querySelector("polygon");
  }

  isRectangle(): boolean {
    return !this.isEllipse() && !this.isPolygon();
  }
}
