// @flow

import ElementSizeUnserializer from "./ElementSizeUnserializer";
import TiledMapBlockObject from "./TiledMapBlockObject";
import TiledMapPositionedObjectUnserializer from "./TiledMapPositionedObjectUnserializer";

import type { ElementSizeUnserializer as ElementSizeUnserializerInterface } from "../interfaces/ElementSizeUnserializer";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
import type { TiledMapBlockObjectSerializedObject } from "../types/TiledMapBlockObjectSerializedObject";
import type { TiledMapBlockObjectUnserializer as TiledMapBlockObjectUnserializerInterface } from "../interfaces/TiledMapBlockObjectUnserializer";
import type { TiledMapPositionedObjectUnserializer as TiledMapPositionedObjectUnserializerInterface } from "../interfaces/TiledMapPositionedObjectUnserializer";

export default class TiledMapBlockObjectUnserializer
  implements TiledMapBlockObjectUnserializerInterface {
  +elementSizeUnserializer: ElementSizeUnserializerInterface<"tile">;
  +tiledMapPositionedObjectUnserializer: TiledMapPositionedObjectUnserializerInterface;

  constructor() {
    this.tiledMapPositionedObjectUnserializer = new TiledMapPositionedObjectUnserializer();
    this.elementSizeUnserializer = new ElementSizeUnserializer();
  }

  fromJson(serialized: string): TiledMapBlockObjectInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(
    parsed: TiledMapBlockObjectSerializedObject
  ): TiledMapBlockObjectInterface {
    return new TiledMapBlockObject(
      this.tiledMapPositionedObjectUnserializer.fromObject(
        parsed.tiledMapPositionedObject
      ),
      this.elementSizeUnserializer.fromObject(parsed.elementSize),
      parsed.source
    );
  }
}
