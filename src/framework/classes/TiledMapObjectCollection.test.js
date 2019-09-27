// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
import Exception from "./Exception";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledMapObjectCollection from "./TiledMapObjectCollection";

it("breaks when asked for a non-existent object", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledMapObjectCollection = new TiledMapObjectCollection(loggerBreadcrumbs, []);

  expect(function() {
    tiledMapObjectCollection.item(0);
  }).toThrow(Exception);
});
