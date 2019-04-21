// @flow

import * as xml from "../helpers/xml";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapPositionedObject from "./TiledMapPositionedObject";

import type { CancelToken } from "../interfaces/CancelToken";
import type { ElementSize as ElementSizeInterface } from "../interfaces/ElementSize";
import type { TiledMapPositionedObject as TiledMapPositionedObjectInterface } from "../interfaces/TiledMapPositionedObject";
import type { TiledMapPositionedObjectParser as TiledMapPositionedObjectParserInterface } from "../interfaces/TiledMapPositionedObjectParser";

export default class TiledMapPositionedObjectParser
  implements TiledMapPositionedObjectParserInterface {
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

  async parse(
    cancelToken: CancelToken
  ): Promise<TiledMapPositionedObjectInterface> {
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

    const tileHeightPixels = this.tileSize.getHeight();
    const tileWidthPixels = this.tileSize.getWidth();

    return new TiledMapPositionedObject(
      objectName,
      new ElementPosition<"tile">(
        objectPositionXPixels / tileWidthPixels,
        objectPositionYPixels / tileHeightPixels
      ),
      new ElementRotation<"radians">(
        0,
        0,
        (-1 * objectRotationYDegrees * Math.PI) / 180
      )
    );
  }
}
