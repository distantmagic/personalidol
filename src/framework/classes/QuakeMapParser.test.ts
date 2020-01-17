import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/classes/QuakeBrush";
import QuakeBrushHalfSpace from "src/framework/classes/QuakeBrushHalfSpace";
import QuakeEntity from "src/framework/classes/QuakeEntity";
import QuakeEntityProperties from "src/framework/classes/QuakeEntityProperties";
import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";
import QuakeMapParser from "src/framework/classes/QuakeMapParser";

import * as fixtures from "src/fixtures";

test("converts quake map format to something processable by controllers", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mapContent = await fixtures.file("map-test.map");
  const quakeMapParser = new QuakeMapParser(loggerBreadcrumbs, mapContent);
  const correct = [
    new QuakeEntity(loggerBreadcrumbs, new QuakeEntityProperties(loggerBreadcrumbs, [new QuakeEntityProperty(loggerBreadcrumbs, "classname", "worldspawn")]), [
      new QuakeBrush(loggerBreadcrumbs, [
        new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -63, -16), new THREE.Vector3(-64, -64, -15), "__TB_empty", 0, 0, 0, 1, 1),
        new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-64, -64, -15), new THREE.Vector3(-63, -64, -16), "__TB_empty", 0, 0, 0, 1, 1),
        new QuakeBrushHalfSpace(new THREE.Vector3(-64, -64, -16), new THREE.Vector3(-63, -64, -16), new THREE.Vector3(-64, -63, -16), "__TB_empty", 0, 0, 0, 1, 1),
        new QuakeBrushHalfSpace(new THREE.Vector3(64, 64, 16), new THREE.Vector3(64, 65, 16), new THREE.Vector3(65, 64, 16), "__TB_empty", 0, 0, 0, 1, 1),
        new QuakeBrushHalfSpace(new THREE.Vector3(64, 64, 16), new THREE.Vector3(65, 64, 16), new THREE.Vector3(64, 64, 17), "__TB_empty", 0, 0, 0, 1, 1),
        new QuakeBrushHalfSpace(new THREE.Vector3(64, 64, 16), new THREE.Vector3(64, 64, 17), new THREE.Vector3(64, 65, 16), "__TB_empty", 0, 0, 0, 1, 1),
      ]),
    ]),
    new QuakeEntity(
      loggerBreadcrumbs,
      new QuakeEntityProperties(loggerBreadcrumbs, [
        new QuakeEntityProperty(loggerBreadcrumbs, "classname", "info_player_start"),
        new QuakeEntityProperty(loggerBreadcrumbs, "origin", "-32 -32 40"),
        new QuakeEntityProperty(loggerBreadcrumbs, "foo", 'bar"baz"booz'),
      ])
    ),
    new QuakeEntity(
      loggerBreadcrumbs,
      new QuakeEntityProperties(loggerBreadcrumbs, [
        new QuakeEntityProperty(loggerBreadcrumbs, "classname", "light"),
        new QuakeEntityProperty(loggerBreadcrumbs, "origin", "16 -32 40"),
        new QuakeEntityProperty(loggerBreadcrumbs, "light", "255"),
      ])
    ),
  ];

  let i = 0;
  for (let entity of quakeMapParser.parse()) {
    expect(entity.isEqual(correct[i])).toBe(true);
    i += 1;
  }
});
