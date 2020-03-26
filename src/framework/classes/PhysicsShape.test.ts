import * as THREE from "three";

import ElementPosition from "src/framework/classes/ElementPosition";
import ElementRotation from "src/framework/classes/ElementRotation";
import ElementSize from "src/framework/classes/ElementSize";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import PhysicsShape from "src/framework/classes/PhysicsShape";
import QuakeBrush from "src/framework/classes/QuakeBrush";
import QuakeBrushHalfSpaceParser from "src/framework/classes/QuakeBrushHalfSpaceParser";

import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

test("THREE boxes are converted into physics engine compatible format", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);
  const origin = new THREE.Vector3(1, 2, 3);
  const physicsShape = new PhysicsShape(origin, quakeBrush);

  const expectedOrigin = new ElementPosition<ElementPositionUnit.Px>(ElementPositionUnit.Px, 1, 2, 3);

  expect(physicsShape.getOrigin().isEqual(expectedOrigin)).toBe(true);

  const expectedRotation = new ElementRotation<ElementRotationUnit.Radians>(ElementRotationUnit.Radians, 0, 0, 0);

  expect(physicsShape.getRotation().isEqual(expectedRotation)).toBe(true);

  const expectedSize = new ElementSize<ElementPositionUnit.Px>(ElementPositionUnit.Px, 128, 32, 128);

  expect(physicsShape.getSize().isEqual(expectedSize)).toBe(true);
});
