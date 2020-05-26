import * as THREE from "three";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeEntity from "src/framework/classes/QuakeEntity";
import QuakeEntityProperties from "src/framework/classes/QuakeEntityProperties";
import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";

test("determines if Entity belongs to a quake class", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [new QuakeEntityProperty(loggerBreadcrumbs, "classname", "player")]);
  const quakeEntity = new QuakeEntity(loggerBreadcrumbs, quakeEntityProperties);

  expect(quakeEntity.isOfClass("player")).toBe(true);
});

test("is able to get entity origin translated to THREE coordinates", function () {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [new QuakeEntityProperty(loggerBreadcrumbs, "origin", "-32 -32 40")]);
  const quakeEntity = new QuakeEntity(loggerBreadcrumbs, quakeEntityProperties);

  expect(quakeEntity.hasOrigin()).toBe(true);

  const origin = new THREE.Vector3(-32, 40, -32);

  expect(quakeEntity.getOrigin().equals(origin)).toBe(true);
});
