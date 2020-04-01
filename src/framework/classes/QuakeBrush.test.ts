import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/classes/QuakeBrush";
import QuakeBrushHalfSpaceParser from "src/framework/classes/QuakeBrushHalfSpaceParser";

function createContext() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);

  return {
    quakeBrush: quakeBrush,
  };
}

let context = createContext();

test("generates vertices from parsed halfspaces", function () {
  const vertices = context.quakeBrush.getVertices();

  expect(vertices).toHaveLength(8);
  expect(vertices[0].equals(new THREE.Vector3(-64, -16, -64))).toBe(true);
  expect(vertices[1].equals(new THREE.Vector3(-64, 16, -64))).toBe(true);
  expect(vertices[2].equals(new THREE.Vector3(64, -16, -64))).toBe(true);
  expect(vertices[3].equals(new THREE.Vector3(64, 16, -64))).toBe(true);
  expect(vertices[4].equals(new THREE.Vector3(-64, -16, 64))).toBe(true);
  expect(vertices[5].equals(new THREE.Vector3(-64, 16, 64))).toBe(true);
  expect(vertices[6].equals(new THREE.Vector3(64, -16, 64))).toBe(true);
  expect(vertices[7].equals(new THREE.Vector3(64, 16, 64))).toBe(true);
});

test("finds halfspace by coplanar points", function () {
  const halfSpace = context.quakeBrush.getHalfSpaceByCoplanarPoints(new THREE.Vector3(64, 16, 64), new THREE.Vector3(64, 16, 32), new THREE.Vector3(32, 16, 32));
  const planeDefiningPoints = halfSpace.getPlaneDefiningPoints();

  const expectedPoints = [new THREE.Vector3(64, 16, 64), new THREE.Vector3(65, 16, 64), new THREE.Vector3(64, 16, 65)];

  expect(planeDefiningPoints[0].equals(expectedPoints[0])).toBe(true);
  expect(planeDefiningPoints[1].equals(expectedPoints[1])).toBe(true);
  expect(planeDefiningPoints[2].equals(expectedPoints[2])).toBe(true);
});
