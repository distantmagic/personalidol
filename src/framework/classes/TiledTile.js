// @flow

import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileImage } from "../interfaces/TiledTileImage";

export default class TiledTile implements TiledTileInterface {
  +id: number;
  +image: TiledTileImage;

  constructor(id: number, image: TiledTileImage) {
    this.id = id;
    this.image = image;
  }

  getId(): number {
    return this.id;
  }

  getTiledTileImage(): TiledTileImage {
    return this.image;
  }
}
