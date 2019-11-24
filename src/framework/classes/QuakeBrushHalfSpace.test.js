// @flow

import * as THREE from "three";

import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

import type { Vector3 } from "three";

test("checks if it's parallel to other half-space", function() {
  const halfSpace1 = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-64, -64, -15),
    new THREE.Vector3(-64, -63, -16),
    "__TB_empty", 0, 0, 0, 1, 1
  );
  const halfSpace2 = new QuakeBrushHalfSpace(
    new THREE.Vector3(64, 64, 16),
    new THREE.Vector3(64, 65, 16),
    new THREE.Vector3(64, 64, 17),
    "__TB_empty", 0, 0, 0, 1, 1
  );
  const halfSpace3 = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-64, -63, -16),
    new THREE.Vector3(-63, -64, -16),
    "__TB_empty", 0, 0, 0, 1, 1
  );

  expect(halfSpace1.isParallel(halfSpace2)).toBe(true);
  expect(halfSpace2.isParallel(halfSpace1)).toBe(true);
  expect(halfSpace1.isParallel(halfSpace3)).toBe(false);
  expect(halfSpace3.isParallel(halfSpace1)).toBe(false);
});

test("finds random point on a plane", function () {
  const halfSpace = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-64, -64, -15),
    new THREE.Vector3(-64, -63, -16),
    "__TB_empty", 0, 0, 0, 1, 1
  );
  const randomPoint = new THREE.Vector3(-64, 0, 0);

  expect(halfSpace.getRandomPoint().equals(randomPoint)).toBe(true);
});

test.each([
  [
    new THREE.Vector3(0, 128, 128),
    new THREE.Vector3(0, 0, 128),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
  [
    new THREE.Vector3(128, 0, 128),
    new THREE.Vector3(0, 0, 128),
    new THREE.Vector3(0, 128, 128),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
  [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 128),
    new THREE.Vector3(0, 0, 128),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
  [
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(0, 128, 128),
    new THREE.Vector3(0, 128, 0),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
  [
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(0, 128, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
  [
    new THREE.Vector3(128, 0, 128),
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(0, 128, 128),
    new THREE.Vector3(32, 32, 32),
    false,
  ],
  [
    new THREE.Vector3(128, 0, 128),
    new THREE.Vector3(128, 128, 0),
    new THREE.Vector3(128, 0, 0),
    new THREE.Vector3(32, 32, 32),
    true,
  ],
])("checks if the point is inside the half-space", function (v1: Vector3, v2: Vector3, v3: Vector3, check: Vector3, corre: bool) {
  const halfSpace = new QuakeBrushHalfSpace(v1, v2, v3, "__TB_empty", 0, 0, 0, 1, 1);

  expect(halfSpace.hasPoint(check)).toBe(corre);
});

test("produces plane with normal vector", function() {
  const halfSpace = new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -64, -15), new THREE.Vector3(-64, -63, -16), "__TB_empty", 0, 0, 0.32, 1, 1);
  const plane = halfSpace.getPlane();
  const correct = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -64);

  expect(plane.equals(correct)).toBe(true);
});
