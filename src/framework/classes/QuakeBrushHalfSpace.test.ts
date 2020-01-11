import * as THREE from "three";

import isEqualWithPrecision from "../helpers/isEqualWithPrecision";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

import { Plane, Vector3 } from "three";

import { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

test("arguments are not changed", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  // prettier-ignore
  const halfSpace = new QuakeBrushHalfSpace(
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(128, 0, 128),
    new THREE.Vector3(0, 128, 128),
    "__TB_empty", 0, 0, 0, 1, 1
  );
  const point = new THREE.Vector3(0, 0, 0);

  halfSpace.containsPoint(point);

  expect(point.equals(new THREE.Vector3(0, 0, 0))).toBe(true);
});

test.each([
  [
    // prettier-ignore
    new QuakeBrushHalfSpace(
      new THREE.Vector3(128, 128, 0),
      new THREE.Vector3(128, 0, 128),
      new THREE.Vector3(0, 128, 128),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    // prettier-ignore
    new THREE.Plane(
      new THREE.Vector3(-1, -1, -1).normalize(),
      147.802
    ),
  ],
])("determines halfspace plane", function(halfSpace: QuakeBrushHalfSpaceInterface, plane: Plane) {
  expect(halfSpace.getPlane().normal.equals(plane.normal)).toBe(true);
  expect(isEqualWithPrecision(halfSpace.getPlane().constant, plane.constant, 3)).toBe(true);
});

test.each([
  [new THREE.Vector3(0, 0, 0), true],
  [new THREE.Vector3(32, 32, 32), true],
  [new THREE.Vector3(128, 128, 128), false],
  [new THREE.Vector3(128, 0, 0), true],
  [new THREE.Vector3(0, 128, 0), true],
  [new THREE.Vector3(0, 0, 128), true],
])("detects if point is inside the plane", function(vector: Vector3, isContained: boolean) {
  // prettier-ignore
  const halfSpace = new QuakeBrushHalfSpace(
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(128, 0, 128),
    new THREE.Vector3(0, 128, 128),
    "__TB_empty", 0, 0, 0, 1, 1
  );
  expect(halfSpace.containsPoint(vector)).toBe(isContained);
});
