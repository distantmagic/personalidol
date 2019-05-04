// @flow

import TiledMapBlockObjectUnserializer from "./TiledMapBlockObjectUnserializer";
import TiledMapEllipseObject from "./TiledMapEllipseObject";

import type { TiledMapEllipseObject as TiledMapEllipseObjectInterface } from "../interfaces/TiledMapEllipseObject";
import type { TiledMapEllipseObjectUnserializer as TiledMapEllipseObjectUnserializerInterface } from "../interfaces/TiledMapEllipseObjectUnserializer";
import type { TiledMapBlockObjectUnserializer as TiledMapBlockObjectUnserializerInterface } from "../interfaces/TiledMapBlockObjectUnserializer";
import type { TiledMapEllipseObjectSerializedObject } from "../types/TiledMapEllipseObjectSerializedObject";

export default class TiledMapEllipseObjectUnserializer
  implements TiledMapEllipseObjectUnserializerInterface {
  +tiledMapBlockObjectUnserializer: TiledMapBlockObjectUnserializerInterface;

  constructor() {
    this.tiledMapBlockObjectUnserializer = new TiledMapBlockObjectUnserializer();
  }

  fromJson(serialized: string): TiledMapEllipseObjectInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(
    parsed: TiledMapEllipseObjectSerializedObject
  ): TiledMapEllipseObjectInterface {
    return new TiledMapEllipseObject(
      this.tiledMapBlockObjectUnserializer.fromObject(
        parsed.tiledMapBlockObject
      )
    );
  }
}
