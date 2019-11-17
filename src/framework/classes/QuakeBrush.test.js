// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

it("generates half spaces trios", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
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
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(64, 65, 16),
      new THREE.Vector3(65, 64, 16),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(65, 64, 16),
      new THREE.Vector3(64, 64, 17),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(64, 64, 17),
      new THREE.Vector3(64, 65, 16),
      "__TB_empty",
      0,
      0,
      0,
      1,
      1
    ),
  ]);

  for (let trio of quakeBrush.generateHalfSpaceTrios()) {
    console.log(trio);
  }
});

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrushHalfSpace1 = new QuakeBrushHalfSpace(
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
  const quakeBrushHalfSpace2 = new QuakeBrushHalfSpace(
    new THREE.Vector3(-34, -34, -16),
    new THREE.Vector3(-34, -63, -16),
    new THREE.Vector3(-34, -34, -15),
    "__TB_empty",
    0,
    0,
    0.33,
    1,
    1
  );
  const quakeBrush1 = new QuakeBrush(loggerBreadcrumbs, [quakeBrushHalfSpace1, quakeBrushHalfSpace2]);
  const quakeBrush2 = new QuakeBrush(loggerBreadcrumbs, [quakeBrushHalfSpace2, quakeBrushHalfSpace1]);
  const quakeBrush3 = new QuakeBrush(loggerBreadcrumbs, [quakeBrushHalfSpace2, quakeBrushHalfSpace2]);

  expect(quakeBrush1.isEqual(quakeBrush2)).toBe(true);
  expect(quakeBrush2.isEqual(quakeBrush1)).toBe(true);
  expect(quakeBrush1.isEqual(quakeBrush3)).toBe(false);
  expect(quakeBrush3.isEqual(quakeBrush1)).toBe(false);
});
