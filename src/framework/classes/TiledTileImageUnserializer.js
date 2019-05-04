// @flow

import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledTileImage from "./TiledTileImage";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { TiledTileImage as TiledTileImageInterface } from "../interfaces/TiledTileImage";
import type { TiledTileImageUnserializer as TiledTileImageUnserializerInterface } from "../interfaces/TiledTileImageUnserializer";
import type { TiledTileImageSerializedObject } from "../types/TiledTileImageSerializedObject";

export default class TiledTileImageUnserializer
  implements TiledTileImageUnserializerInterface {
  +elementSizeUnserializer: ElementSizeUnserializerInterface<"px">;

  constructor() {
    this.elementSizeUnserializer = new ElementSizeUnserializer();
  }

  fromJson(serialized: string): TiledTileImageInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledTileImageSerializedObject): TiledTileImageInterface {
    return new TiledTileImage(
      parsed.source,
      this.elementSizeUnserializer.fromObject(parsed.elementSize)
    );
  }
}
