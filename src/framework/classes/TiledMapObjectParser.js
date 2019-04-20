// @flow

import * as xml from "../helpers/xml";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import ElementSize from "./ElementSize";
import TiledMapObject from "./TiledMapObject";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { TiledMapObject as TiledMapObjectInterface } from "../interfaces/TiledMapObject";
import type { TiledMapObjectParser as TiledMapObjectParserInterface } from "../interfaces/TiledMapObjectParser";

export default class TiledMapObjectParser
  implements TiledMapObjectParserInterface {
  +mapFilename: string;
  +objectElement: HTMLElement;
  +tileSize: ElementSizeInterface<"px">;

  constructor(
    mapFilename: string,
    objectElement: HTMLElement,
    tileSize: ElementSizeInterface<"px">
  ) {
    this.mapFilename = mapFilename;
    this.objectElement = objectElement;
    this.tileSize = tileSize;
  }

  async parse(cancelToken: CancelToken): Promise<TiledMapObjectInterface> {
    const objectDepthElement = this.objectElement.querySelector(
      "property[name=depth][type=int]"
    );

    if (!objectDepthElement) {
      throw new Error("Object depth is not specified.");
    }

    const objectDepthPixels = xml.getNumberAttribute(
      objectDepthElement,
      "value"
    );
    const objectHeightPixels = xml.getNumberAttribute(
      this.objectElement,
      "height"
    );
    const objectName = xml.getStringAttribute(this.objectElement, "name");
    const objectPositionXPixels = xml.getNumberAttribute(
      this.objectElement,
      "x"
    );
    const objectPositionYPixels = xml.getNumberAttribute(
      this.objectElement,
      "y"
    );
    const objectRotationYDegrees = xml.getNumberAttribute(
      this.objectElement,
      "rotation",
      0
    );
    const objectWidthPixels = xml.getNumberAttribute(
      this.objectElement,
      "width"
    );

    const tileHeightPixels = this.tileSize.getHeight();
    const tileWidthPixels = this.tileSize.getWidth();

    if (tileHeightPixels !== tileWidthPixels) {
      throw new Error("Non-square tiles are not supported with 3D objects.");
    }

    return new TiledMapObject(
      objectName,
      new ElementPosition<"tile">(
        objectPositionXPixels / tileWidthPixels,
        objectPositionYPixels / tileHeightPixels
      ),
      new ElementRotation<"radians">(
        0,
        0,
        (-1 * objectRotationYDegrees * Math.PI) / 180
      ),
      new ElementSize<"tile">(
        objectWidthPixels / tileWidthPixels,
        objectHeightPixels / tileHeightPixels,
        objectDepthPixels / tileHeightPixels
      )
    );
  }
}
