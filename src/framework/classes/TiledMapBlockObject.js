// @flow

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
      elementSize: this.getElementSize().asObject(),
      source: this.hasSource() ? this.getSource() : null,
      tiledMapPositionedObject: this.getTiledMapPositionedObject().asObject(),
    };
  }

  getElementSize(): ElementSize<"tile"> {
    return this.elementSize;
  }

  getTiledMapPositionedObject(): TiledMapPositionedObject {
    return this.tiledMapPositionedObject;
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

  isEqual(other: TiledMapBlockObjectInterface): boolean {
    if (this.hasSource() !== other.hasSource()) {
      return false;
    }

    if (this.hasSource() && this.getSource() !== other.getSource()) {
      return false;
    }

    return (
      this.getElementSize().isEqual(other.getElementSize()) &&
      this.getTiledMapPositionedObject().isEqual(other.getTiledMapPositionedObject())
    );
  }
}
