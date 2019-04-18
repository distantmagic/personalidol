// @flow

import * as fixtures from "../../../fixtures";
import TiledTilesetParser from "../TiledTilesetParser";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";
import type { TiledTileset } from "../../interfaces/TiledTileset";

export default class FixturesTiledTileset implements Query<TiledTileset> {
  +ref: string;

  constructor(ref: string) {
    this.ref = ref;
  }

  async execute(cancelToken: CancelToken): Promise<?TiledTileset> {
    const tilesetContent = await fixtures.file(this.ref);
    const tiledTilesetParser = new TiledTilesetParser(tilesetContent);

    return tiledTilesetParser.parse(cancelToken);
  }

  isEqual(other: FixturesTiledTileset): boolean {
    return this.ref === other.ref;
  }
}
