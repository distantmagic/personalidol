// @flow

import type { Ellipse as TiledMapEllipseObjectInterface } from "./TiledMapObject/Ellipse";
import type { Rectangle as TiledMapRectangleObjectInterface } from "./TiledMapObject/Rectangle";
import type { Polygon as TiledMapPolygonObjectInterface } from "./TiledMapObject/Polygon";
import type { TiledMapObjectCollection as TiledMapObjectCollectionInterface } from "../interfaces/TiledMapObjectCollection";

export default class TiledMapObjectCollection implements TiledMapObjectCollectionInterface {
  addEllipseObject(tiledMapEllipseObject: TiledMapEllipseObject): void {
    console.log(tiledMapEllipseObject);
  }

  addRectangleObject(tiledMapRectangleObject: TiledMapRectangleObject): void {
    console.log(tiledMapRectangleObject);
  }

  addPolygonObject(tiledMapPolygonObject: TiledMapPolygonObject): void {
    console.log(tiledMapPolygonObject);
  }
}
