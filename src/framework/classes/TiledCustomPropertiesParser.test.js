// @flow

import * as fixtures from "../../fixtures";
import assert from "../helpers/assert";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledCustomPropertiesParser from "./TiledCustomPropertiesParser";

it("parses tiled custom properties", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const propertiesDocument = await fixtures.xmlFile(
    "map-custom-properties-01.xml"
  );
  const propertiesHTMLElement = assert<HTMLElement>(
    loggerBreadcrumbs,
    propertiesDocument.documentElement
  );
  const tiledCustomPropertiesParser = new TiledCustomPropertiesParser(
    loggerBreadcrumbs,
    propertiesHTMLElement
  );
  const tiledCustomProperties = await tiledCustomPropertiesParser.parse(
    cancelToken
  );

  expect(tiledCustomProperties.hasPropertyByName("walkabilityMap")).toBe(true);

  const tiledCustomProperty = tiledCustomProperties.getPropertyByName(
    "walkabilityMap"
  );

  expect(tiledCustomProperty.getName()).toBe("walkabilityMap");
  expect(tiledCustomProperty.getType()).toBe("bool");
  expect(tiledCustomProperty.getValue()).toBe("true");
  expect(tiledCustomProperty.isTruthy()).toBe(true);
});
