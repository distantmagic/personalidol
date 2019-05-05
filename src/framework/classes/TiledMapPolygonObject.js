// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPolygonObjectSerializedObject } from "../types/TiledMapPolygonObjectSerializedObject";
import type { TiledMapPositionedObject } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapPolygonObject
  implements TiledMapPolygonObjectInterface {
  +depth: number;
  +isEllipse: false;
  +isPolygon: true;
  +isRectangle: false;
  +polygonPoints: Array<ElementPosition<"tile">>;
  +tiledMapPositionedObject: TiledMapPositionedObject;

  isEllipse = false;
  isPolygon = true;
  isRectangle = false;

  constructor(
    tiledMapPositionedObject: TiledMapPositionedObject,
    polygonPoints: Array<ElementPosition<"tile">>,
    depth: number
  ) {
    this.depth = depth;
    this.polygonPoints = polygonPoints;
    this.tiledMapPositionedObject = tiledMapPositionedObject;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledMapPolygonObjectSerializedObject {
    return {
      depth: this.depth,
      polygonPoints: this.polygonPoints.map(polygonPoint =>
        polygonPoint.asObject()
      ),
      tiledMapPositionedObject: this.getTiledMapPositionedObject().asObject()
    };
  }

  getDepth(): number {
    return this.depth;
  }

  getPolygonPoints(): Array<ElementPosition<"tile">> {
    return this.polygonPoints;
  }

  getTiledMapPositionedObject(): TiledMapPositionedObject {
    return this.tiledMapPositionedObject;
  }

  isEqual(other: TiledMapPolygonObjectInterface): boolean {
    if (this.getDepth() !== other.getDepth()) {
      return false;
    }

    if (
      !this.getTiledMapPositionedObject().isEqual(
        other.getTiledMapPositionedObject()
      )
    ) {
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
