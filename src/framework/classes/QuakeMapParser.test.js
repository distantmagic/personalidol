// @flow

import * as THREE from "three";

import * as fixtures from "../../fixtures";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpace from "./QuakeBrushHalfSpace";
import QuakeEntity from "./QuakeEntity";
import QuakeEntityProperties from "./QuakeEntityProperties";
import QuakeEntityProperty from "./QuakeEntityProperty";
import QuakeMap from "./QuakeMap";
import QuakeMapParser from "./QuakeMapParser";

test("converts quake map format to something processable by controllers", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapContent = await fixtures.file("map-test.map");
  const quakeMapParser = new QuakeMapParser(loggerBreadcrumbs, mapContent);
  const quakeMap = quakeMapParser.parse();
  const correct = new QuakeMap(loggerBreadcrumbs, [
    new QuakeEntity(loggerBreadcrumbs, new QuakeEntityProperties(loggerBreadcrumbs, [new QuakeEntityProperty("classname", "worldspawn")]), [
      new QuakeBrush(loggerBreadcrumbs, [
        new QuakeBrushHalfSpace(
          new THREE.Vector3(-64, -16, 64),
          new THREE.Vector3(-64, -16, 63),
          new THREE.Vector3(-64, -15, 64),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
        new QuakeBrushHalfSpace(
          new THREE.Vector3(-64, -16, 64),
          new THREE.Vector3(-64, -15, 64),
          new THREE.Vector3(-63, -16, 64),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
        new QuakeBrushHalfSpace(
          new THREE.Vector3(-64, -16, 64),
          new THREE.Vector3(-63, -16, 64),
          new THREE.Vector3(-64, -16, 63),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
        new QuakeBrushHalfSpace(
          new THREE.Vector3(64, 16, -64),
          new THREE.Vector3(64, 16, -65),
          new THREE.Vector3(65, 16, -64),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
        new QuakeBrushHalfSpace(
          new THREE.Vector3(64, 16, -64),
          new THREE.Vector3(65, 16, -64),
          new THREE.Vector3(64, 17, -64),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
        new QuakeBrushHalfSpace(
          new THREE.Vector3(64, 16, -64),
          new THREE.Vector3(64, 17, -64),
          new THREE.Vector3(64, 16, -65),
          "__TB_empty", 0, 0, 0, 1, 1
        ),
      ]),
    ]),
    new QuakeEntity(
      loggerBreadcrumbs,
      new QuakeEntityProperties(loggerBreadcrumbs, [
        new QuakeEntityProperty("classname", "info_player_start"),
        new QuakeEntityProperty("origin", "-32 -32 40"),
        new QuakeEntityProperty("foo", 'bar"baz"booz'),
      ])
    ),
    new QuakeEntity(
      loggerBreadcrumbs,
      new QuakeEntityProperties(loggerBreadcrumbs, [
        new QuakeEntityProperty("classname", "light"),
        new QuakeEntityProperty("origin", "16 -32 40"),
        new QuakeEntityProperty("light", "255"),
      ])
    ),
  ]);

  expect(quakeMap.isEqual(correct)).toBe(true);
});
