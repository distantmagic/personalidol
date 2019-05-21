// @flow

import ElementPositionUnserializer from "./ElementPositionUnserializer";
import TiledMapPolygonObject from "./TiledMapPolygonObject";
import TiledMapPositionedObjectUnserializer from "./TiledMapPositionedObjectUnserializer";

import type { ElementPositionUnserializer as ElementPositionUnserializerInterface } from "../interfaces/ElementPositionUnserializer";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPolygonObjectSerializedObject } from "../types/TiledMapPolygonObjectSerializedObject";
import type { TiledMapPolygonObjectUnserializer as TiledMapPolygonObjectUnserializerInterface } from "../interfaces/TiledMapPolygonObjectUnserializer";
import type { TiledMapPositionedObjectUnserializer as TiledMapPositionedObjectUnserializerInterface } from "../interfaces/TiledMapPositionedObjectUnserializer";

export default class TiledMapPolygonObjectUnserializer implements TiledMapPolygonObjectUnserializerInterface {
  +elementPositionUnserializer: ElementPositionUnserializerInterface<"tile">;
  +tiledMapPositionedObjectUnserializer: TiledMapPositionedObjectUnserializerInterface;

  constructor() {
    this.elementPositionUnserializer = new ElementPositionUnserializer();
    this.tiledMapPositionedObjectUnserializer = new TiledMapPositionedObjectUnserializer();
  }

  fromJson(serialized: string): TiledMapPolygonObjectInterface {
    return this.fromObject(JSON.parse(serialized));
  }

  fromObject(parsed: TiledMapPolygonObjectSerializedObject): TiledMapPolygonObjectInterface {
    const polygonPoints = [];

    for (let polygonPoint of parsed.polygonPoints) {
      polygonPoints.push(this.elementPositionUnserializer.fromObject(polygonPoint));
    }

    return new TiledMapPolygonObject(
      this.tiledMapPositionedObjectUnserializer.fromObject(parsed.tiledMapPositionedObject),
      polygonPoints,
      parsed.depth
    );
  }
}
