// @flow

import * as THREE from "three";

import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

it("checks if it's parallel to other half-space", function() {
  const halfSpace1 = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-64, -63, -16),
    new THREE.Vector3(-64, -64, -15),
    "__TB_empty",
    0,
    0,
    0,
    1,
    1
  );
  const halfSpace2 = new QuakeBrushHalfSpace(
    new THREE.Vector3(64, 64, 16),
    new THREE.Vector3(64, 64, 17),
    new THREE.Vector3(64, 65, 16),
    "__TB_empty",
    0,
    0,
    0,
    1,
    1
  );
  const halfSpace3 = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-63, -64, -16),
    new THREE.Vector3(-64, -63, -16),
    "__TB_empty",
    0,
    0,
    0,
    1,
    1
  );

  expect(halfSpace1.isParallel(halfSpace2)).toBe(true);
  expect(halfSpace2.isParallel(halfSpace1)).toBe(true);
  expect(halfSpace1.isParallel(halfSpace3)).toBe(false);
  expect(halfSpace3.isParallel(halfSpace1)).toBe(false);
});

it("produces plane with normal vector", function() {
  const halfSpace = new QuakeBrushHalfSpace(
    new THREE.Vector3(-64, -64, -16),
    new THREE.Vector3(-64, -63, -16),
    new THREE.Vector3(-64, -64, -15),
    "__TB_empty",
    0,
    0,
    0.32,
    1,
    1
  );
  const plane = halfSpace.getPlane();
  const correct = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -64);

  expect(plane.equals(correct)).toBe(true);
});
