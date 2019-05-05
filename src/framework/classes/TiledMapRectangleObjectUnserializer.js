// @flow

import TiledMapBlockObjectUnserializer from "./TiledMapBlockObjectUnserializer";
import TiledMapRectangleObject from "./TiledMapRectangleObject";

import type { TiledMapRectangleObject as TiledMapRectangleObjectInterface } from "../interfaces/TiledMapRectangleObject";
import type { TiledMapRectangleObjectUnserializer as TiledMapRectangleObjectUnserializerInterface } from "../interfaces/TiledMapRectangleObjectUnserializer";
import type { TiledMapBlockObjectUnserializer as TiledMapBlockObjectUnserializerInterface } from "../interfaces/TiledMapBlockObjectUnserializer";
import type { TiledMapRectangleObjectSerializedObject } from "../types/TiledMapRectangleObjectSerializedObject";

export default class TiledMapRectangleObjectUnserializer
  implements TiledMapRectangleObjectUnserializerInterface {
  +tiledMapBlockObjectUnserializer: TiledMapBlockObjectUnserializerInterface;

  constructor() {
    this.tiledMapBlockObjectUnserializer = new TiledMapBlockObjectUnserializer();
  }

  fromJson(serialized: string): TiledMapRectangleObjectInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(
    parsed: TiledMapRectangleObjectSerializedObject
  ): TiledMapRectangleObjectInterface {
    return new TiledMapRectangleObject(
      this.tiledMapBlockObjectUnserializer.fromObject(
        parsed.tiledMapBlockObject
      )
    );
  }
}
