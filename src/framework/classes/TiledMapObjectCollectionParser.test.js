// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledMapObjectCollectionParser from "./TiledMapObjectCollectionParser";

it("parses object collection", async function() {
  const documentElement = await fixtures.xmlFile("map-fixture-01.tmx");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const tiledMapObjectCollectionParser = new TiledMapObjectCollectionParser(loggerBreadcrumbs, documentElement);
  const tiledMapObjectCollection = await tiledMapObjectCollectionParser.parse(cancelToken);
});
