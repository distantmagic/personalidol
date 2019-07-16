// @flow

import Exception from "./Exception";

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMapObject as TiledMapObjectInterface } from "../interfaces/TiledMapObject";

export default class TiledMapObject implements TiledMapObjectInterface {
  +elementPosition: ElementPosition<"tile">;
  +elementRotation: ElementRotation<"radians">;
  +elementSize: ElementSize<"tile">;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +name: string;
  +source: ?string;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    name: string,
    elementPosition: ElementPosition<"tile">,
    elementRotation: ElementRotation<"radians">,
    elementSize: ElementSize<"tile">,
    source: ?string
  ) {
    this.elementPosition = elementPosition;
    this.elementRotation = elementRotation;
    this.elementSize = elementSize;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.name = name;
    this.source = source;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.elementPosition;
  }

  getElementRotation(): ElementRotation<"radians"> {
    return this.elementRotation;
  }

  getElementSize(): ElementSize<"tile"> {
    return this.elementSize;
  }

  getSource(): string {
    const source = this.source;

    if (!source) {
      throw new Exception(this.loggerBreadcrumbs.add("getSource"), "Source is not defined and it was expected.");
    }

    return source;
  }

  hasSource(): boolean {
    return "string" === typeof this.source;
  }

  getName(): string {
    return this.name;
  }

  isEqual(other: TiledMapObjectInterface): boolean {
    if (this.hasSource() !== other.hasSource()) {
      return false;
    }

    if (this.hasSource() && this.getSource() !== other.getSource()) {
      return false;
    }

    return (
      this.getName() === other.getName() &&
      this.getElementPosition().isEqual(other.getElementPosition()) &&
      this.getElementRotation().isEqual(other.getElementRotation()) &&
      this.getElementSize().isEqual(other.getElementSize())
    );
  }
}
