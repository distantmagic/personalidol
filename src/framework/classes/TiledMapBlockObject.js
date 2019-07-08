// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
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
