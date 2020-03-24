import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "src/framework/classes/QuakeBrushHalfSpace";
import QuakeBrushHalfSpaceParser from "src/framework/classes/QuakeBrushHalfSpaceParser";

test("converts quake map format to something processable by controllers", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "   ( 8 -216 16 ) ( -120 -216 128 ) ( 8 -88    128 ) __TB_empty -0   -0.522125 -0   1   1  ");
  const halfSpace = parser.parse();
  // prettier-ignore
  const correct = new QuakeBrushHalfSpace(
    new THREE.Vector3(-216, 16, 8),
    new THREE.Vector3(-216, 128, -120),
    new THREE.Vector3(-88, 128, 8),
    "__TB_empty", -0, -0.522125, -0, 1, 1
  );

  expect(halfSpace.isEqual(correct)).toBe(true);
});
