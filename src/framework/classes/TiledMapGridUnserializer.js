// @flow

import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledMapGrid from "./TiledMapGrid";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { TiledMapGrid as TiledMapGridInterface } from "../interfaces/TiledMapGrid";
import type { TiledMapGridUnserializer as TiledMapGridUnserializerInterface } from "../interfaces/TiledMapGridUnserializer";
import type { TiledMapGridSerializedObject } from "../types/TiledMapGridSerializedObject";

export default class TiledMapGridUnserializer
  implements TiledMapGridUnserializerInterface {
  +elementSizeUnserializer: ElementSizeUnserializerInterface<"tile">;

  constructor() {
    this.elementSizeUnserializer = new ElementSizeUnserializer();
  }

  fromJson(serialized: string): TiledMapGridInterface {
    const parsed = JSON.parse(serialized);

    return this.fromObject(parsed);
  }

  fromObject(parsed: TiledMapGridSerializedObject): TiledMapGridInterface {
    return new TiledMapGrid(
      parsed.grid,
      this.elementSizeUnserializer.fromObject(parsed.gridSize)
    );
  }
}
