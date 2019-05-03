// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
import type { TiledMapBlockObjectSerializedObject } from "../types/TiledMapBlockObjectSerializedObject";
import type { TiledMapPositionedObject } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapBlockObject implements TiledMapBlockObjectInterface {
  +elementSize: ElementSize<"tile">;
  +source: ?string;
  +tiledMapPositionedObject: TiledMapPositionedObject;

  constructor(
    tiledMapPositionedObject: TiledMapPositionedObject,
    elementSize: ElementSize<"tile">,
    source: ?string
  ): void {
    this.elementSize = elementSize;
    this.tiledMapPositionedObject = tiledMapPositionedObject;
    this.source = source;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapBlockObjectSerializedObject {
    return {
      elementPosition: this.getElementPosition().asObject(),
      elementRotation: this.getElementRotation().asObject(),
      elementSize: this.getElementSize().asObject(),
      name: this.getName(),
      source: this.hasSource() ? this.getSource() : null,
    };
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

  getSource(): string {
    const source = this.source;

    if (!source) {
      throw new Error("Block object source is not specified but was expected.");
    }

    return source;
  }

  hasSource(): boolean {
    return !!this.source;
  }
}
