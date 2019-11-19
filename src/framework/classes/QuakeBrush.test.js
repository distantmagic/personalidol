// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

import type { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

let halfSpaces: $ReadOnlyArray<QuakeBrushHalfSpaceInterface> = [];

beforeEach(() => {
  halfSpaces = [
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
  ];
});

it("generates half spaces trios", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, halfSpaces);

  // 3-element combinations without repetitions from 6-element set
  expect(Array.from(quakeBrush.generateHalfSpaceTrios())).toHaveLength(20);
});

it("generates vertices", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, halfSpaces);
  const vertices = quakeBrush.getVertices();

  expect(vertices).toHaveLength(8);
  expect(vertices[0].equals(new THREE.Vector3(-64, -64, -16))).toBe(true);
  expect(vertices[1].equals(new THREE.Vector3(-64, -64, 16))).toBe(true);
  expect(vertices[2].equals(new THREE.Vector3(-64, 64, -16))).toBe(true);
  expect(vertices[3].equals(new THREE.Vector3(-64, 64, 16))).toBe(true);
  expect(vertices[4].equals(new THREE.Vector3(64, -64, -16))).toBe(true);
  expect(vertices[5].equals(new THREE.Vector3(64, -64, 16))).toBe(true);
  expect(vertices[6].equals(new THREE.Vector3(64, 64, -16))).toBe(true);
  expect(vertices[7].equals(new THREE.Vector3(64, 64, 16))).toBe(true);
});

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush1 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[0], halfSpaces[1], halfSpaces[2], halfSpaces[3]]);
  const quakeBrush2 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[1], halfSpaces[0], halfSpaces[2], halfSpaces[3]]);
  const quakeBrush3 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[1], halfSpaces[1], halfSpaces[2], halfSpaces[3]]);

  expect(quakeBrush1.isEqual(quakeBrush2)).toBe(true);
  expect(quakeBrush2.isEqual(quakeBrush1)).toBe(true);
  expect(quakeBrush1.isEqual(quakeBrush3)).toBe(false);
  expect(quakeBrush3.isEqual(quakeBrush1)).toBe(false);
});
