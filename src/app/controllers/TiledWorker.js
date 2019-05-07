// @flow

import TiledMapLoader from "../../framework/classes/TiledMapLoader";
import TiledTilesetLoader from "../../framework/classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../../framework/classes/URLTextContentQueryBuilder";
// import { default as GameboardView } from "../views/Gameboard";

import type { CancelToken } from "../../framework/interfaces/CancelToken";

export default class TiledWorker {
  async load(cancelToken: CancelToken): Promise<{ foo: string }> {
    console.log(cancelToken);
    // const queryBuilder = new URLTextContentQueryBuilder();
    // const tiledTilesetLoader = new TiledTilesetLoader(
    //   breadcrumbs.add("TiledTilesetLoader"),
    //   this.queryBus,
    //   queryBuilder
    // );
    // const tiledMapLoader = new TiledMapLoader(
    //   breadcrumbs.add("TiledMapLoader"),
    //   this.queryBus,
    //   queryBuilder,
    //   tiledTilesetLoader
    // );

    // const tiledMap = await tiledMapLoader.load(
    //   cancelToken,
    //   "/assets/map-outlands-01.tmx"
    // );

    return {
      foo: "barzzzzz"
    };
  }
}
