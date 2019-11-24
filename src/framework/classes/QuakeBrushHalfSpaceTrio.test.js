// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";

import type { Vector3 } from "three";

import type { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

function getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpaceInterface> {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  return [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -0 -128 128 ) ( -0 -128 -0 ) ( -0 -0 -0 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 128 -128 -0 ) ( -0 -128 -0 ) ( -0 -128 128 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -0 -0 -0 ) ( -0 -128 -0 ) ( 128 -128 -0 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 128 -0 128 ) ( -0 -128 128 ) ( -0 -0 128 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 128 -0 128 ) ( -0 -0 128 ) ( -0 -0 -0 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 128 -128 -0 ) ( -0 -128 128 ) ( 128 -0 128 ) __TB_empty -0 -0 -0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 128 -128 -0 ) ( 128 -0 128 ) ( 128 -0 -0 ) __TB_empty -0 -0 -0 1 1").parse(),
  ];
}

test("finds intersecting point", function() {
  const halfSpaces = [
    new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -63, -16), new THREE.Vector3(-64, -64, -15), "__TB_empty", 0, 0, 0, 1, 1),
    new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -64, -15), new THREE.Vector3(-63, -64, -16), "__TB_empty", 0, 0, 0, 1, 1),
    new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-63, -64, -16), new THREE.Vector3(-64, -63, -16), "__TB_empty", 0, 0, 0, 1, 1)
  ];
  const trio = new QuakeBrushHalfSpaceTrio(
    new LoggerBreadcrumbs(),
    ...halfSpaces
  );

  expect(trio.hasIntersectingPoint()).toBe(true);

  const correct = new THREE.Vector3(-64, -64, -16);

  expect(trio.getIntersectingPoint().equals(correct)).toBe(true);
});

test.each([
  [0, 1, 2, true, new THREE.Vector3(0, 0, 128)],
  [0, 1, 3, true, new THREE.Vector3(0, 128, 128)],
  [0, 1, 4, false, null],
  [0, 1, 5, true, new THREE.Vector3(0, 128, 128)],
  [0, 1, 6, false, null],
  [0, 2, 3, false, null],
  [0, 2, 4, true, new THREE.Vector3(0, 0, 0)],
  [0, 2, 6, false, null],
  [0, 3, 4, true, new THREE.Vector3(0, 128, 0)],
  [0, 3, 5, true, new THREE.Vector3(0, 128, 128)],
  [0, 3, 6, false, null],
  [0, 4, 6, false, null],
  [0, 5, 6, false, null],
  [1, 2, 3, false, null],
  [1, 2, 4, false, null],
  [1, 2, 5, true, new THREE.Vector3(128, 0, 128)],
  [1, 2, 6, true, new THREE.Vector3(128, 0, 128)],
  [1, 3, 4, false, null],
  [1, 3, 5, true, new THREE.Vector3(0, 128, 128)],
  [1, 4, 5, false, null],
  [1, 4, 6, false, null],
  [1, 5, 6, true, new THREE.Vector3(128, 0, 128)],
  [2, 3, 4, false, null],
  [2, 3, 5, false, null],
  [2, 3, 6, false, null],
  [2, 4, 6, true, new THREE.Vector3(128, 0, 0)],
  [2, 5, 6, true, new THREE.Vector3(128, 0, 128)],
  [3, 4, 5, true, new THREE.Vector3(128, 128, 0)],
  [3, 4, 6, true, new THREE.Vector3(128, 128, 0)],
  [3, 5, 6, true, new THREE.Vector3(128, 128, 0)],
  [4, 5, 6, true, new THREE.Vector3(128, 128, 0)],

  // these are not a part of the target polyhedron, but those are valid
  // intersection points, whether they belong to the final block should be
  // determined inside the QuakeBrush
  [0, 2, 5, true, new THREE.Vector3(0, 0, 256)],
  [0, 4, 5, true, new THREE.Vector3(0, 256, 0)],
  [1, 3, 6, true, new THREE.Vector3(128, 128, 128)],
  [2, 4, 5, true, new THREE.Vector3(256, 0, 0)],
])("determines intersecting point for [%d, %d, %d]", function(i1: number, i2: number, i3: number, hasIntersectingPoint: boolean, correct?: Vector3) {
  const halfSpaces = getHalfSpaces();
  const trio = new QuakeBrushHalfSpaceTrio(new LoggerBreadcrumbs(), halfSpaces[i1], halfSpaces[i2], halfSpaces[i3]);

  expect(trio.hasIntersectingPoint()).toBe(hasIntersectingPoint);

  if (!hasIntersectingPoint) {
    return;
  }

  const intersectingPoint = trio.getIntersectingPoint();

  if (!correct) {
    throw new Error("Expected intersection point, got nothing.");
  }

  expect(intersectingPoint.equals(correct)).toBe(true);
});
