// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";
import QuakeBrushHalfSpaceTrio from "./QuakeBrushHalfSpaceTrio";

it("finds intersecting point", function() {
  const trio = new QuakeBrushHalfSpaceTrio(
    new LoggerBreadcrumbs(),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-64, -63, -16),
      new THREE.Vector3(-64, -64, -15),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-64, -64, -15),
      new THREE.Vector3(-63, -64, -16),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-63, -64, -16),
      new THREE.Vector3(-64, -63, -16),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    )
  );

  expect(trio.hasIntersectingPoint()).toBe(true);

  const correct = new THREE.Vector3(-64, -64, -16);

  expect(trio.getIntersectingPoint().equals(correct)).toBe(true);
});
