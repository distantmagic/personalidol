// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { TiledMapPositionedObject as TiledMapPositionedObjectInterface } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapPositionedObject implements TiledMapPositionedObjectInterface {
  +elementPosition: ElementPosition<"tile">;
  +elementRotation: ElementRotation<"radians">;
  +name: string;

  constructor(
    name: string,
    elementPosition: ElementPosition<"tile">,
    elementRotation: ElementRotation<"radians">
  ): void {
    this.elementPosition = elementPosition;
    this.elementRotation = elementRotation;
    this.name = name;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.elementPosition;
  }

  getElementRotation(): ElementRotation<"radians"> {
    return this.elementRotation;
  }

  getName(): string {
    return this.name;
  }

  isEqual(other: TiledMapPositionedObjectInterface): boolean {
    return (
      this.getName() === other.getName() &&
      this.getElementPosition().isEqual(other.getElementPosition()) &&
      this.getElementRotation().isEqual(other.getElementRotation())
    );
  }
}
