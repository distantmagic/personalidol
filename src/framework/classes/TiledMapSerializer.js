// @flow

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap } from "../interfaces/TiledMap";
import type { TiledMapSerializedObject } from "../types/TiledMapSerializedObject";
import type { TiledMapSerializer as TiledMapSerializerInterface } from "../interfaces/TiledMapSerializer";

export default class TiledMapSerializer implements TiledMapSerializerInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledMap: TiledMap;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tiledMap: TiledMap) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMap = tiledMap;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapSerializedObject {
    const mapSize = this.tiledMap.getMapSize();
    const ellipseObjects = this.tiledMap.getEllipseObjects();
    const polygonObjects = this.tiledMap.getPolygonObjects();
    const rectangleObjects = this.tiledMap.getRectangleObjects();
    const layers = this.tiledMap.getLayers();

    return {
      foo: true,
    };
  }
}
