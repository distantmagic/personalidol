import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakePointParser from "src/framework/classes/QuakePointParser";

test("parses a set of coordinates into THREE Vector", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakePointParser(loggerBreadcrumbs, "  16 -32       40   ");

  expect(parser.parse().equals(new THREE.Vector3(16, -32, 40))).toBe(true);
});
