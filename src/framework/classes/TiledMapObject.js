// @flow

import Exception from "./Exception";
import TiledCustomProperty from "./TiledCustomProperty";
import TiledCustomPropertiesException from "./Exception/Tiled/CustomProperties";

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperties } from "../interfaces/TiledCustomProperties";
import type { TiledMapObject as TiledMapObjectInterface } from "../interfaces/TiledMapObject";

export default class TiledMapObject implements TiledMapObjectInterface {
  +elementPosition: ElementPosition<"tile">;
  +elementRotation: ElementRotation<"radians">;
  +elementSize: ElementSize<"tile">;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +name: string;
  +tiledCustomProperties: TiledCustomProperties;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    name: string,
    elementPosition: ElementPosition<"tile">,
    elementRotation: ElementRotation<"radians">,
    elementSize: ElementSize<"tile">,
    tiledCustomProperties: TiledCustomProperties
  ) {
    this.elementPosition = elementPosition;
    this.elementRotation = elementRotation;
    this.elementSize = elementSize;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.name = name;
    this.tiledCustomProperties = tiledCustomProperties;
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
    const sourceProperty = this.tiledCustomProperties.getPropertyByName("source");

    if ("string" !== sourceProperty.getType()) {
      throw new TiledCustomPropertiesException(this.loggerBreadcrumbs.add("getSource"), "Custom object source must be a string.");
    }

    return sourceProperty.getValue();
  }

  hasSource(): boolean {
    return this.tiledCustomProperties.hasPropertyByName("source");
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
