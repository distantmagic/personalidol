// @flow strict

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";

test("generates vertices from parsed halfspaces", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);
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

test("finds halfspace by coplanar points", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);

  const v1 = new THREE.Vector3(64, 64, 16);
  const v2 = new THREE.Vector3(32, 64, 16);
  const v3 = new THREE.Vector3(32, 32, 16);

  quakeBrush.getHalfSpaceByCoplanarPoints(v1, v2, v3);
});
