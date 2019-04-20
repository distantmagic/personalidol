// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapObject as TiledMapObjectInterface } from "../interfaces/TiledMapObject";

export default class TiledMapObject implements TiledMapObjectInterface {
  +elementPosition: ElementPosition<"tile">;
  +elementRotation: ElementRotation<"radians">;
  +elementSize: ElementSize<"tile">;
  +name: string;

  constructor(
    name: string,
    elementPosition: ElementPosition<"tile">,
    elementRotation: ElementRotation<"radians">,
    elementSize: ElementSize<"tile">
  ): void {
    this.elementPosition = elementPosition;
    this.elementRotation = elementRotation;
    this.elementSize = elementSize;
    this.name = name;
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

  getName(): string {
    return this.name;
  }
}
