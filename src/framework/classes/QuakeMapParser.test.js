// @flow

import * as fixtures from "../../fixtures";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeMapParser from "./QuakeMapParser";

it("converts quake map format to something processable by controllers", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapContent = await fixtures.file("map-test.map");
  const quakeMapParser = new QuakeMapParser(loggerBreadcrumbs, mapContent);

  console.log(quakeMapParser.parse());
});
