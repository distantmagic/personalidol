// @flow

import * as THREE from "three";

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushGeometryBuilder from "./QuakeBrushGeometryBuilder";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";
import QuakeMapTextureLoader from "./QuakeMapTextureLoader";

test("generates faces from quake brush", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);

  // const quakeBrushGeometry = new QuakeBrushGeometryBuilder(quakeBrush);
  // const imageMock = document.createElement("img");
  // const texture = new THREE.Texture(imageMock);

  // texture.name = "__TB_empty";

  // const geometry = quakeBrushGeometry.getGeometry([texture]);
});
