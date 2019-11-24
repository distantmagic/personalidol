// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";

test("converts quake map format to something processable by controllers", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "   ( 8 -216 16 ) ( -120 -216 128 ) ( 8 -88    128 ) __TB_empty -0   -0.522125 -0   1   1  ");
  const halfSpace = parser.parse();
  const correct = new QuakeBrushHalfSpace(new THREE.Vector3(8, 16, 216), new THREE.Vector3(-120, 128, 216), new THREE.Vector3(8, 128, 88), "__TB_empty", -0, -0.522125, -0, 1, 1);

  expect(halfSpace.isEqual(correct)).toBe(true);
});
