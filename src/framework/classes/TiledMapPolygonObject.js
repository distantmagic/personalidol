// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPositionedObject } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapPolygonObject implements TiledMapPolygonObjectInterface {
  +depth: number;
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;
  +polygonPoints: $ReadOnlyArray<ElementPosition<"tile">>;
  +tiledMapPositionedObject: TiledMapPositionedObject;

  isEllipse = false;
  isPolygon = true;
  isRectangle = false;

  constructor(
    tiledMapPositionedObject: TiledMapPositionedObject,
    polygonPoints: $ReadOnlyArray<ElementPosition<"tile">>,
    depth: number
  ) {
    this.depth = depth;
    this.polygonPoints = polygonPoints;
    this.tiledMapPositionedObject = tiledMapPositionedObject;
  }

  getDepth(): number {
    return this.depth;
  }

  getPolygonPoints(): $ReadOnlyArray<ElementPosition<"tile">> {
    return this.polygonPoints;
  }

  getTiledMapPositionedObject(): TiledMapPositionedObject {
    return this.tiledMapPositionedObject;
  }

  isEqual(other: TiledMapPolygonObjectInterface): boolean {
    if (this.getDepth() !== other.getDepth()) {
      return false;
    }

    if (!this.getTiledMapPositionedObject().isEqual(other.getTiledMapPositionedObject())) {
      return false;
    }

    const polygonPoints = this.getPolygonPoints();
    const otherPolygonPoints = other.getPolygonPoints();

    if (polygonPoints.length !== otherPolygonPoints.length) {
      return false;
    }

    for (let i = 0; i < polygonPoints.length; i += 1) {
      if (!polygonPoints[i].isEqual(otherPolygonPoints[i])) {
        return false;
      }
    }

    return true;
  }
}
