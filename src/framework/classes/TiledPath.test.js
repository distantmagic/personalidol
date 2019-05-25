// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledPath from "./TiledPath";

it("determines if step is on track", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 10));

  expect(tiledPath.hasStep(new ElementPosition<"tile">(0, 10))).toBe(true);
  expect(tiledPath.hasStep(new ElementPosition<"tile">(0, 5))).toBe(true);
  expect(tiledPath.hasStep(new ElementPosition<"tile">(1, 5))).toBe(false);
});

it("finds closest point to a path", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 10));

  const step3 = new ElementPosition<"tile">(10, 10);
  tiledPath.addStep(step3);

  tiledPath.addStep(new ElementPosition<"tile">(20, 10));

  expect(tiledPath.getClosestStep(new ElementPosition<"tile">(11, 10))).toBe(step3);
});

it("finds closest next step", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 1));
  tiledPath.addStep(new ElementPosition<"tile">(0, 2));

  const step3 = new ElementPosition<"tile">(0, 3);
  tiledPath.addStep(step3);

  const step4 = new ElementPosition<"tile">(0, 4);
  tiledPath.addStep(step4);

  expect(tiledPath.getClosestNextStep(new ElementPosition<"tile">(0, 2))).toBe(step3);
  expect(tiledPath.getClosestNextStep(new ElementPosition<"tile">(0, 2.3))).toBe(step3);
  expect(tiledPath.getClosestNextStep(new ElementPosition<"tile">(0, 2.9))).toBe(step3);
  expect(tiledPath.getClosestNextStep(new ElementPosition<"tile">(0, 3.5))).toBe(step4);
});

it("finds closest previous step", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 1));

  const correctStep = new ElementPosition<"tile">(0, 2);
  tiledPath.addStep(correctStep);

  tiledPath.addStep(new ElementPosition<"tile">(0, 3));

  expect(tiledPath.getClosestPreviousStep(new ElementPosition<"tile">(0, 2.3))).toBe(correctStep);
  expect(tiledPath.getClosestPreviousStep(new ElementPosition<"tile">(0, 2.9))).toBe(correctStep);
  expect(tiledPath.getClosestPreviousStep(new ElementPosition<"tile">(0, 3))).toBe(correctStep);
});

it("finds distance at a position", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 1));
  tiledPath.addStep(new ElementPosition<"tile">(0, 2));
  tiledPath.addStep(new ElementPosition<"tile">(1, 2));
  tiledPath.addStep(new ElementPosition<"tile">(2, 2));
  tiledPath.addStep(new ElementPosition<"tile">(3, 2));
  tiledPath.addStep(new ElementPosition<"tile">(3, 3));
  tiledPath.addStep(new ElementPosition<"tile">(3, 4));
  tiledPath.addStep(new ElementPosition<"tile">(2, 4));
  tiledPath.addStep(new ElementPosition<"tile">(1, 4));
  tiledPath.addStep(new ElementPosition<"tile">(1, 3));
  tiledPath.addStep(new ElementPosition<"tile">(1, 2));

  const elementPosition1 = new ElementPosition<"tile">(3, 2.75);
  const assumedDistance1 = tiledPath.getDistanceAtElementPosition(elementPosition1);
  const correctDistance1 = 5.75;

  expect(assumedDistance1).toBe(correctDistance1);
  expect(tiledPath.getElementPositionAtDistance(correctDistance1).isEqual(elementPosition1)).toBe(true);

  const elementPosition2 = new ElementPosition<"tile">(1.5, 4);
  const assumedDistance2 = tiledPath.getDistanceAtElementPosition(elementPosition2);
  const correctDistance2 = 8.5;

  expect(assumedDistance2).toBe(correctDistance2);
  expect(tiledPath.getElementPositionAtDistance(correctDistance2).isEqual(elementPosition2)).toBe(true);
});

it("finds position at a distance", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 1));
  tiledPath.addStep(new ElementPosition<"tile">(0, 2));
  tiledPath.addStep(new ElementPosition<"tile">(1, 2));
  tiledPath.addStep(new ElementPosition<"tile">(2, 2));
  tiledPath.addStep(new ElementPosition<"tile">(3, 2));
  tiledPath.addStep(new ElementPosition<"tile">(3, 3));
  tiledPath.addStep(new ElementPosition<"tile">(3, 4));
  tiledPath.addStep(new ElementPosition<"tile">(2, 4));
  tiledPath.addStep(new ElementPosition<"tile">(1, 4));
  tiledPath.addStep(new ElementPosition<"tile">(1, 3));
  tiledPath.addStep(new ElementPosition<"tile">(1, 2));

  const assumedPosition1 = tiledPath.getElementPositionAtDistance(5.75);
  const correctPosition1 = new ElementPosition<"tile">(3, 2.75);

  expect(assumedPosition1.isEqual(correctPosition1)).toBe(true);

  const assumedPosition2 = tiledPath.getElementPositionAtDistance(8.5);
  const correctPosition2 = new ElementPosition<"tile">(1.5, 4);

  expect(assumedPosition2.isEqual(correctPosition2)).toBe(true);
});

it("finds rotation at a distance", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 1));
  tiledPath.addStep(new ElementPosition<"tile">(0, 2));
  tiledPath.addStep(new ElementPosition<"tile">(1, 2));

  const assumedRotation = tiledPath.getElementRotationAtDistance(2.5);
  const correctRotation = new ElementRotation<"radians">(0, Math.PI / 2, 0);

  expect(assumedRotation.isEqual(correctRotation)).toBe(true);
});

it("has length", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledPath = new TiledPath(loggerBreadcrumbs);

  tiledPath.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath.addStep(new ElementPosition<"tile">(0, 10));
  tiledPath.addStep(new ElementPosition<"tile">(10, 10));

  expect(tiledPath.getLength()).toBe(20);
});

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledPath1 = new TiledPath(loggerBreadcrumbs);
  tiledPath1.addStep(new ElementPosition<"tile">(0, 0));
  tiledPath1.addStep(new ElementPosition<"tile">(1, 1));

  const tiledPath2 = new TiledPath(loggerBreadcrumbs);
  tiledPath2.addStep(new ElementPosition<"tile">(1, 1));
  tiledPath2.addStep(new ElementPosition<"tile">(0, 0));

  expect(tiledPath1.isEqual(tiledPath2)).toBe(false);
});
