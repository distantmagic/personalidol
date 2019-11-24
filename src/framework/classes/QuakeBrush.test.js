// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";

import type { QuakeBrushHalfSpace as QuakeBrushHalfSpaceInterface } from "../interfaces/QuakeBrushHalfSpace";

function getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpaceInterface[]> {
  let halfSpaces = [];

  halfSpaces.push([
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-64, -64, -15),
      new THREE.Vector3(-64, -63, -16),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-63, -64, -16),
      new THREE.Vector3(-64, -64, -15),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(-64, -64, -16),
      new THREE.Vector3(-64, -63, -16),
      new THREE.Vector3(-63, -64, -16),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(65, 64, 16),
      new THREE.Vector3(64, 65, 16),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(64, 64, 17),
      new THREE.Vector3(65, 64, 16),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(64, 64, 16),
      new THREE.Vector3(64, 65, 16),
      new THREE.Vector3(64, 64, 17),
      "__TB_empty", 0, 0, 0, 1, 1
    ),
  ]);
  halfSpaces.push([
    new QuakeBrushHalfSpace(
      new THREE.Vector3(48, 48, 42),
      new THREE.Vector3(14, 40, 8),
      new THREE.Vector3(48, 40, 42),
      "__TB_empty", 0.529099, -0, -0, 0.707107, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(48, 48, -26),
      new THREE.Vector3(14, 40, 8),
      new THREE.Vector3(14, 48, 8),
      "__TB_empty", 0.529099, -0, -0, 0.707107, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(14, 40, 8),
      new THREE.Vector3(80, 40, 8),
      new THREE.Vector3(48, 40, 42),
      "__TB_empty", 0.00291634, -0.526184, 45, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(80, 48, 8),
      new THREE.Vector3(14, 48, 8),
      new THREE.Vector3(48, 48, 42),
      "__TB_empty", 0.00291634, -0.526184, 45, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(80, 48, 8),
      new THREE.Vector3(48, 48, 42),
      new THREE.Vector3(48, 40, 42),
      "__TB_empty", 0.529106, -0, -0, 0.707107, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(80, 40, 8),
      new THREE.Vector3(48, 48, -26),
      new THREE.Vector3(80, 48, 8),
      "__TB_empty", -0.291397, -0, 180, 0.707107, -1
    ),
  ]);
  halfSpaces.push([
    new QuakeBrushHalfSpace(
      new THREE.Vector3(0, 112, 128),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 128),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(128, 0, 128),
      new THREE.Vector3(0, 112, 128),
      new THREE.Vector3(0, 0, 128),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(128, 0, 128),
      new THREE.Vector3(0, 0, 128),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(0, 112, 0),
      new THREE.Vector3(0, 112, 128),
      new THREE.Vector3(128, 112, 0),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(128, 0, 0),
      new THREE.Vector3(0, 112, 0),
      new THREE.Vector3(128, 112, 0),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(0, 112, 128),
      new THREE.Vector3(128, 0, 128),
      new THREE.Vector3(128, 112, 0),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
    new QuakeBrushHalfSpace(
      new THREE.Vector3(128, 0, 128),
      new THREE.Vector3(128, 0, 0),
      new THREE.Vector3(128, 112, 0),
      "__TB_empty", -0, -0, -0, 1, 1
    ),
  ]);

  return halfSpaces;
}

test("is equatable", function() {
  const halfSpaces = getHalfSpaces();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush1 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[0][0], halfSpaces[0][1], halfSpaces[0][2], halfSpaces[0][3]]);
  const quakeBrush2 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[0][1], halfSpaces[0][0], halfSpaces[0][2], halfSpaces[0][3]]);
  const quakeBrush3 = new QuakeBrush(loggerBreadcrumbs, [halfSpaces[0][1], halfSpaces[0][1], halfSpaces[0][2], halfSpaces[0][3]]);

  expect(quakeBrush1.isEqual(quakeBrush2)).toBe(true);
  expect(quakeBrush2.isEqual(quakeBrush1)).toBe(true);
  expect(quakeBrush1.isEqual(quakeBrush3)).toBe(false);
  expect(quakeBrush3.isEqual(quakeBrush1)).toBe(false);
});

test("generates vertices from perfectly aligned points set", function() {
  const halfSpaces = getHalfSpaces();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, halfSpaces[0]);
  const vertices = quakeBrush.getVertices();

  // 3-element combinations without repetitions from 6-element set
  expect(Array.from(quakeBrush.generateHalfSpaceTrios())).toHaveLength(20);
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

test("generates vertices from rotated points set", function() {
  const halfSpaces = getHalfSpaces();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, halfSpaces[1]);
  const vertices = quakeBrush.getVertices();

  expect(Array.from(quakeBrush.generateHalfSpaceTrios())).toHaveLength(20);
  expect(vertices).toHaveLength(8);
  expect(vertices[0].equals(new THREE.Vector3(14, 40, 8))).toBe(true);
  expect(vertices[1].equals(new THREE.Vector3(14, 48, 8))).toBe(true);
  expect(vertices[2].equals(new THREE.Vector3(48, 40, 42))).toBe(true);
  expect(vertices[3].equals(new THREE.Vector3(48, 48, 42))).toBe(true);
  expect(vertices[4].equals(new THREE.Vector3(48, 40, -26))).toBe(true);
  expect(vertices[5].equals(new THREE.Vector3(48, 48, -26))).toBe(true);
  expect(vertices[6].equals(new THREE.Vector3(80, 40, 8))).toBe(true);
  expect(vertices[7].equals(new THREE.Vector3(80, 48, 8))).toBe(true);
});

test("generates vertices from clipped shape", function() {
  const halfSpaces = getHalfSpaces();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, halfSpaces[2]);
  const vertices = quakeBrush.getVertices();

  // 3-element combinations without repetitions from 7-element set
  expect(Array.from(quakeBrush.generateHalfSpaceTrios())).toHaveLength(35);
  expect(vertices).toHaveLength(7);
});
