// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushGeometry from "./QuakeBrushGeometry";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";

// test("generates faces from quake brush", function () {
//   const loggerBreadcrumbs = new LoggerBreadcrumbs();
//   const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 4 -14 30 ) ( -28 109 38 ) ( 5 109 162 ) textures/texture-cardboard-512x512 -0 -0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 91 142 6 ) ( -28 109 38 ) ( 4 -14 30 ) textures/texture-cardboard-512x512 -0 -0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 5 109 162 ) ( -28 109 38 ) ( 91 142 6 ) textures/texture-cardboard-512x512 0 0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 37 -14 154 ) ( 156 19 122 ) ( 123 19 -2 ) textures/texture-cardboard-512x512 0 0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 5 109 162 ) ( 156 19 122 ) ( 37 -14 154 ) textures/texture-cardboard-512x512 -0 -0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 91 142 6 ) ( 156 19 122 ) ( 5 109 162 ) textures/texture-asphalt-256x256 -0 -0 0 1 1").parse(),
//     new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 123 19 -2 ) ( 156 19 122 ) ( 91 142 6 ) textures/texture-cardboard-512x512 -0 -0 0 1 1").parse(),
//   ]);
//   const quakeBrushGeometry = new QuakeBrushGeometry(quakeBrush);
//   const geometry = quakeBrushGeometry.getGeometry();
// });

test("generates faces from quake brush", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);
  const quakeBrushGeometry = new QuakeBrushGeometry(quakeBrush);
  const geometry = quakeBrushGeometry.getGeometry();
});
