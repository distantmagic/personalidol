// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakePointParser from "./QuakePointParser";

test("parses a set of coordinates into THREE Vector", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakePointParser(loggerBreadcrumbs, "  16 -32       40   ");

  expect(parser.parse().equals(new THREE.Vector3(16, -32, 40))).toBe(true);
});
