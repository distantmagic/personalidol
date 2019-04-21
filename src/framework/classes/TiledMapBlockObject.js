// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
import type { TiledMapPositionedObject } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapBlockObject
  implements TiledMapBlockObjectInterface {
  +elementSize: ElementSize<"tile">;
  +tiledMapPositionedObject: TiledMapPositionedObject;

  constructor(
    tiledMapPositionedObject: TiledMapPositionedObject,
    elementSize: ElementSize<"tile">
  ): void {
    this.elementSize = elementSize;
    this.tiledMapPositionedObject = tiledMapPositionedObject;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.tiledMapPositionedObject.getElementPosition();
  }

  getElementRotation(): ElementRotation<"radians"> {
    return this.tiledMapPositionedObject.getElementRotation();
  }

  getElementSize(): ElementSize<"tile"> {
    return this.elementSize;
  }

  getName(): string {
    return this.tiledMapPositionedObject.getName();
  }
}
