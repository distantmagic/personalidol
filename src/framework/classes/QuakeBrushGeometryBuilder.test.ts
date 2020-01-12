import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/classes/QuakeBrush";
import QuakeBrushGeometryBuilder from "src/framework/classes/QuakeBrushGeometryBuilder";
import QuakeBrushHalfSpaceParser from "src/framework/classes/QuakeBrushHalfSpaceParser";

test("generates geometry from quake brush", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeBrush = new QuakeBrush(loggerBreadcrumbs, [
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 65 16 ) ( 65 64 16 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 65 64 16 ) ( 64 64 17 ) __TB_empty 0 0 0 1 1").parse(),
    new QuakeBrushHalfSpaceParser(loggerBreadcrumbs, "( 64 64 16 ) ( 64 64 17 ) ( 64 65 16 ) __TB_empty 0 0 0 1 1").parse(),
  ]);

  const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

  quakeBrushGeometryBuilder.addBrush(quakeBrush);

  expect(quakeBrushGeometryBuilder.getIndices()).toHaveLength(36);
  expect(quakeBrushGeometryBuilder.getNormals()).toHaveLength(96);
  expect(quakeBrushGeometryBuilder.getTexturesIndices()).toHaveLength(32);
  expect(quakeBrushGeometryBuilder.getTexturesNames()).toEqual(["__TB_empty"]);
  expect(quakeBrushGeometryBuilder.getUvs()).toHaveLength(64);
  expect(quakeBrushGeometryBuilder.getVertices()).toHaveLength(96);

  const geometry = quakeBrushGeometryBuilder.getGeometry();

  expect(geometry.getAttribute("normal").count).toBe(32);
  expect(geometry.getAttribute("position").count).toBe(32);
  expect(geometry.getAttribute("texture_index").count).toBe(32);
  expect(geometry.getAttribute("uv").count).toBe(32);
});
