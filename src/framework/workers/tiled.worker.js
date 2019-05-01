// @flow

import CancelToken from "../classes/CancelToken";
import ForcedTick from "../classes/ForcedTick";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import QueryBus from "../classes/QueryBus";
import TiledMapLoader from "../classes/TiledMapLoader";
import TiledTilesetLoader from "../classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../classes/URLTextContentQueryBuilder";

self.addEventListener("message", onMessage);

async function onMessage(event) {
  // console.log(event.data, self);
  const breadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(breadcrumbs);
  const queryBuilder = new URLTextContentQueryBuilder();
  const queryBus = new QueryBus(breadcrumbs);

  setInterval(function () {
    queryBus.tick(new ForcedTick(false));
  });

  const tiledTilesetLoader = new TiledTilesetLoader(
    breadcrumbs.add("TiledTilesetLoader"),
    queryBus,
    queryBuilder
  );
  const tiledMapLoader = new TiledMapLoader(
    breadcrumbs.add("TiledMapLoader"),
    queryBus,
    queryBuilder,
    tiledTilesetLoader
  );

  const tiledMap = await tiledMapLoader.load(
    cancelToken,
    "/assets/map-outlands-01.tmx"
  );

  console.log(tiledMap);

  // let initial = event.data;
  // setInterval(() => this.postMessage(initial++), 1000);
}
