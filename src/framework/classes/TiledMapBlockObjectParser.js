// @flow

import * as xml from "../helpers/xml";
import ElementSize from "./ElementSize";
import TiledMapBlockObject from "./TiledMapBlockObject";
import TiledMapPositionedObjectParser from "./TiledMapPositionedObjectParser";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { TiledMapBlockObject as TiledMapBlockObjectInterface } from "../interfaces/TiledMapBlockObject";
import type { TiledMapBlockObjectParser as TiledMapBlockObjectParserInterface } from "../interfaces/TiledMapBlockObjectParser";

export default class TiledMapBlockObjectParser
  implements TiledMapBlockObjectParserInterface {
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

  async parse(cancelToken: CancelToken): Promise<TiledMapBlockObjectInterface> {
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
    const objectWidthPixels = xml.getNumberAttribute(
      this.objectElement,
      "width"
    );

    const tileHeightPixels = this.tileSize.getHeight();
    const tileWidthPixels = this.tileSize.getWidth();

    if (tileHeightPixels !== tileWidthPixels) {
      throw new Error("Non-square tiles are not supported with 3D objects.");
    }

    const tiledMapPositionedObjectParser = new TiledMapPositionedObjectParser(
      this.mapFilename,
      this.objectElement,
      this.tileSize
    );

    return new TiledMapBlockObject(
      await tiledMapPositionedObjectParser.parse(cancelToken),
      new ElementSize<"tile">(
        objectWidthPixels / tileWidthPixels,
        objectHeightPixels / tileHeightPixels,
        objectDepthPixels / tileHeightPixels
      )
    );
  }
}
