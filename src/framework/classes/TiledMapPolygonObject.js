// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { ElementRotation } from "../interfaces/ElementRotation";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPositionedObject } from "../interfaces/TiledMapPositionedObject";

export default class TiledMapPolygonObject
  implements TiledMapPolygonObjectInterface {
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
    polygonPoints: Array<ElementPosition<"tile">>
  ) {
    this.polygonPoints = polygonPoints;
    this.tiledMapPositionedObject = tiledMapPositionedObject;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.tiledMapPositionedObject.getElementPosition();
  }

  getElementRotation(): ElementRotation<"radians"> {
    return this.tiledMapPositionedObject.getElementRotation();
  }

  getName(): string {
    return this.tiledMapPositionedObject.getName();
  }
}
