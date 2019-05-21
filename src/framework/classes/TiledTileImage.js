// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledTileImage as TiledTileImageInterface } from "../interfaces/TiledTileImage";
import type { TiledTileImageSerializedObject } from "../types/TiledTileImageSerializedObject";

export default class TiledTileImage implements TiledTileImageInterface {
  +elementSize: ElementSize<"px">;
  +source: string;

  constructor(source: string, elementSize: ElementSize<"px">): void {
    this.elementSize = elementSize;
    this.source = source;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledTileImageSerializedObject {
    return {
      elementSize: this.getElementSize().asObject(),
      source: this.getSource(),
    };
  }

  getElementSize(): ElementSize<"px"> {
    return this.elementSize;
  }

  getSource(): string {
    return this.source;
  }

  isEqual(other: TiledTileImageInterface) {
    return this.getSource() === other.getSource() && this.getElementSize().isEqual(other.getElementSize());
  }
}
