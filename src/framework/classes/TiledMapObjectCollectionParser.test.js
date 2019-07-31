// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledMapObjectCollectionParser from "./TiledMapObjectCollectionParser";

it("parses object collection", async function() {
  const mapDocument = await fixtures.xmlFile("map-fixture-01.tmx");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapHTMLElement = assert<HTMLElement>(loggerBreadcrumbs, mapDocument.documentElement);
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const tiledMapObjectCollectionParser = new TiledMapObjectCollectionParser(loggerBreadcrumbs, mapHTMLElement);
  const tiledMapObjectCollection = await tiledMapObjectCollectionParser.parse(cancelToken);
});
