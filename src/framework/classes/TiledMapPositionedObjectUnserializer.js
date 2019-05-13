// @flow

import ElementPositionUnserializer from "./ElementPositionUnserializer";
import ElementRotationUnserializer from "./ElementRotationUnserializer";
import TiledMapPositionedObject from "./TiledMapPositionedObject";

import type { ElementPositionUnserializer as ElementPositionUnserializerInterface } from "../interfaces/ElementPositionUnserializer";
import type { ElementRotationUnserializer as ElementRotationUnserializerInterface } from "../interfaces/ElementRotationUnserializer";
import type { TiledMapPositionedObject as TiledMapPositionedObjectInterface } from "../interfaces/TiledMapPositionedObject";
import type { TiledMapPositionedObjectSerializedObject } from "../types/TiledMapPositionedObjectSerializedObject";
import type { TiledMapPositionedObjectUnserializer as TiledMapPositionedObjectUnserializerInterface } from "../interfaces/TiledMapPositionedObjectUnserializer";

export default class TiledMapPositionedObjectUnserializer
  implements TiledMapPositionedObjectUnserializerInterface {
  +elementPositionUnserializer: ElementPositionUnserializerInterface<"tile">;
  +elementRotationUnserializer: ElementRotationUnserializerInterface<"radians">;

  constructor() {
    this.elementPositionUnserializer = new ElementPositionUnserializer();
    this.elementRotationUnserializer = new ElementRotationUnserializer();
  }

  fromJson(serialized: string): TiledMapPositionedObjectInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(
    parsed: TiledMapPositionedObjectSerializedObject
  ): TiledMapPositionedObjectInterface {
    return new TiledMapPositionedObject(
      parsed.name,
      this.elementPositionUnserializer.fromObject(parsed.elementPosition),
      this.elementRotationUnserializer.fromObject(parsed.elementRotation)
    );
  }
}
