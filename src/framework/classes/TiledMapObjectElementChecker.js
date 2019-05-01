// @flow

import type { TiledMapObjectElementChecker as TiledMapObjectElementCheckerInterface } from "../interfaces/TiledMapObjectElementChecker";

export default class TiledMapObjectElementChecker
  implements TiledMapObjectElementCheckerInterface {
  +objectElement: HTMLElement;

  constructor(objectElement: HTMLElement) {
    this.objectElement = objectElement;
  }

  isEllipse(): boolean {
    return this.objectElement.getElementsByTagName("ellipse").length > 0;
  }

  isPolygon(): boolean {
    return this.objectElement.getElementsByTagName("polygon").length > 0;
  }

  isRectangle(): boolean {
    return !this.isEllipse() && !this.isPolygon();
  }
}
