// @flow

import TiledTileImageUnserializer from "./TiledTileImageUnserializer";
import TiledTile from "./TiledTile";

import type { TiledTileImageUnserializer as TiledTileImageUnserializerInterface } from "../interfaces/TiledTileImageUnserializer";
import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileUnserializer as TiledTileUnserializerInterface } from "../interfaces/TiledTileUnserializer";
import type { TiledTileSerializedObject } from "../types/TiledTileSerializedObject";

export default class TiledTileUnserializer
  implements TiledTileUnserializerInterface {
  +tiledTileImageUnserializer: TiledTileImageUnserializerInterface;

  constructor() {
    this.tiledTileImageUnserializer = new TiledTileImageUnserializer();
  }

  fromJson(serialized: string): TiledTileInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledTileSerializedObject): TiledTileInterface {
    return new TiledTile(
      parsed.id,
      this.tiledTileImageUnserializer.fromObject(parsed.tiledTileImage)
    );
  }
}
