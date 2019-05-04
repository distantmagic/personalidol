// @flow

import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledMapGridUnserializer from "./TiledMapGridUnserializer";
import TiledMapLayer from "./TiledMapLayer";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { TiledMapGridUnserializer as TiledMapGridUnserializerInterface } from "../interfaces/TiledMapGridUnserializer";
import type { TiledMapLayer as TiledMapLayerInterface } from "../interfaces/TiledMapLayer";
import type { TiledMapLayerSerializedObject } from "../types/TiledMapLayerSerializedObject";
import type { TiledMapLayerUnserializer as TiledMapLayerUnserializerInterface } from "../interfaces/TiledMapLayerUnserializer";

export default class TiledMapLayerUnserializer
  implements TiledMapLayerUnserializerInterface {
  +elementSizeUnserializer: ElementSizeUnserializerInterface<"tile">;
  +tiledMapGridUnserializer: TiledMapGridUnserializerInterface;

  constructor() {
    this.elementSizeUnserializer = new ElementSizeUnserializer();
    this.tiledMapGridUnserializer = new TiledMapGridUnserializer();
  }

  fromJson(serialized: string): TiledMapLayerInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledMapLayerSerializedObject): TiledMapLayerInterface {
    return new TiledMapLayer(
      parsed.name,
      this.tiledMapGridUnserializer.fromObject(parsed.tiledMapGrid),
      this.elementSizeUnserializer.fromObject(parsed.layerSize)
    );
  }
}
