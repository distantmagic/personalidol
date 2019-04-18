// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileImage } from "../interfaces/TiledTileImage";

export default class TiledTile implements TiledTileInterface {
  +id: string;
  +image: TiledTileImage;

  constructor(id: string, image: TiledTileImage) {
    this.id = id;
    this.image = image;
  }

  getId(): string {
    return this.id;
  }
}
