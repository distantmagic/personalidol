// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";

it("converts quake map format to something processable by controllers", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "        ( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0.32 1 1");
  const halfSpace = parser.parse();
  const correct = new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -63, -16), new THREE.Vector3(-64, -64, -15), "__TB_empty", 0, 0, 0.32, 1, 1);

  expect(halfSpace.isEqual(correct)).toBe(true);
});
