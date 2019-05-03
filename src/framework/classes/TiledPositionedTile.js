// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledPositionedTile as TiledPositionedTileInterface } from "../interfaces/TiledPositionedTile";

export default class TiledPositionedTile
  implements TiledPositionedTileInterface {
  +elementPosition: ElementPosition<"tile">;
  +id: number;

  constructor(id: number, elementPosition: ElementPosition<"tile">) {
    this.elementPosition = elementPosition;
    this.id = id;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.elementPosition;
  }

  getId(): number {
    return this.id;
  }

  isEqual(other: TiledPositionedTileInterface): boolean {
    return (
      this.getId() === other.getId() &&
      this.getElementPosition().isEqual(other.getElementPosition())
    );
  }
}
