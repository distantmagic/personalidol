// @flow

import * as xml from "../helpers/xml";
import TiledMapPolygonObject from "./TiledMapPolygonObject";
import TiledMapPolygonPointsParser from "./TiledMapPolygonPointsParser";
import TiledMapPositionedObjectParser from "./TiledMapPositionedObjectParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledMapPolygonObject as TiledMapPolygonObjectInterface } from "../interfaces/TiledMapPolygonObject";
import type { TiledMapPolygonObjectParser as TiledMapPolygonObjectParserInterface } from "../interfaces/TiledMapPolygonObjectParser";

export default class TiledMapPolygonObjectParser
  implements TiledMapPolygonObjectParserInterface {
  +mapFilename: string;
  +objectElement: HTMLElement;
  +tileSize: ElementSize<"px">;

  constructor(
    mapFilename: string,
    objectElement: HTMLElement,
    tileSize: ElementSize<"px">
  ) {
    this.mapFilename = mapFilename;
    this.objectElement = objectElement;
    this.tileSize = tileSize;
  }

  async parse(
    cancelToken: CancelToken
  ): Promise<TiledMapPolygonObjectInterface> {
    const polygonElement = this.objectElement.querySelector("polygon[points]");

    if (!polygonElement) {
      throw new Error("Polygon points element is not defined");
    }

    const tiledMapPositionedObjectParser = new TiledMapPositionedObjectParser(
      this.mapFilename,
      this.objectElement,
      this.tileSize
    );
    const tiledMapPolygonPointsParser = new TiledMapPolygonPointsParser(
      xml.getStringAttribute(polygonElement, "points"),
      this.tileSize
    );

    const objectDepthElement = this.objectElement.querySelector(
      "property[name=depth][type=int]"
    );

    if (!objectDepthElement) {
      throw new Error("Object depth is not specified.");
    }

    return new TiledMapPolygonObject(
      await tiledMapPositionedObjectParser.parse(cancelToken),
      await tiledMapPolygonPointsParser.parse(cancelToken),
      xml.getNumberAttribute(objectDepthElement, "value") /
        this.tileSize.getWidth()
    );
  }
}
