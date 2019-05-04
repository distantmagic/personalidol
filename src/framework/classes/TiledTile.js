// @flow

import type { TiledTile as TiledTileInterface } from "../interfaces/TiledTile";
import type { TiledTileImage } from "../interfaces/TiledTileImage";
import type { TiledTileSerializedObject } from "../types/TiledTileSerializedObject";

export default class TiledTile implements TiledTileInterface {
  +id: number;
  +image: TiledTileImage;

  constructor(id: number, image: TiledTileImage) {
    this.id = id;
    this.image = image;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledTileSerializedObject {
    return {
      id: this.id,
      tiledTileImage: this.getTiledTileImage().asObject()
    };
  }

  getId(): number {
    return this.id;
  }

  getTiledTileImage(): TiledTileImage {
    return this.image;
  }

  isEqual(other: TiledTileInterface): boolean {
    return (
      this.getId() === other.getId() &&
      this.getTiledTileImage().isEqual(other.getTiledTileImage())
    );
  }
}
