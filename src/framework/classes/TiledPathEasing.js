// @flow

import ElementPosition from "./ElementPosition";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { TiledPath } from "../interfaces/TiledPath";
import type { TiledPathEasing as TiledPathEasingInterface } from "../interfaces/TiledPathEasing";

export default class TiledPathEasing<T: ElementPositionUnit> implements TiledPathEasingInterface<T> {
  +tiledPath: TiledPath<T>;

  constructor(tiledPath: TiledPath<T>) {
    this.tiledPath = tiledPath;
  }

  getElementPositionAtTime(unitsPerSecond: number, seconds: number): ElementPositionInterface<T> {
    return this.tiledPath.getElementPositionAtDistance(unitsPerSecond * seconds);
  }
}
