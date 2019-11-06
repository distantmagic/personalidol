// @flow

import * as THREE from "three";
import noop from "lodash/noop";

import CanvasPointerController from "./CanvasPointerController";

import type { Object3D } from "three";

import type { CanvasPointerResponder } from "../interfaces/CanvasPointerResponder";

class FooPointerResponder implements CanvasPointerResponder<boolean> {
  +mockNothingIntersected: Function;
  +mockMakeResponsive: Function;
  +mockRespond: Function;

  constructor(
    mockMakeResponsive: Function = noop,
    mockNothingIntersected: Function = noop,
    mockRespond: Function = noop
  ) {
    this.mockMakeResponsive = mockMakeResponsive;
    this.mockNothingIntersected = mockNothingIntersected;
    this.mockRespond = mockRespond;
  }

  makeResponsive(object: Object3D): ?boolean {
    this.mockMakeResponsive();

    return true;
  }

  onNothingIntersected(): void {
    this.mockNothingIntersected();
  }

  respond(item: boolean): void {
    this.mockRespond();
  }
}

class RaycasterMock extends THREE.Raycaster {
  +intersections: $ReadOnlyArray<Object3D>;

  constructor(intersections: $ReadOnlyArray<Object3D>) {
    super();

    this.intersections = intersections;
  }

  intersectObjects(): $ReadOnlyArray<{|
    distance: number,
    object: Object3D,
  |}> {
    return this.intersections.map(object => ({
      distance: 0,
      object: object,
    }));
  }
}

it("handles multiple pointer responders", function() {
  const raycaster = new THREE.Raycaster();
  const scene = new THREE.Scene();
  const canvasPointerController = new CanvasPointerController(raycaster, scene);
  const fooResponder = new FooPointerResponder();

  expect(canvasPointerController.hasResponder(fooResponder)).toBe(false);

  canvasPointerController.addResponder(fooResponder);

  expect(canvasPointerController.hasResponder(fooResponder)).toBe(true);

  canvasPointerController.deleteResponder(fooResponder);

  expect(canvasPointerController.hasResponder(fooResponder)).toBe(false);
});

it("reacts to no intersections", function() {
  const mockMakeResponsive = jest.fn();
  const mockNothingIntersected = jest.fn();
  const mockRespond = jest.fn();
  const raycaster = new RaycasterMock([]);
  const scene = new THREE.Scene();
  const canvasPointerController = new CanvasPointerController(raycaster, scene);
  const fooResponder = new FooPointerResponder(mockMakeResponsive, mockNothingIntersected, mockRespond);

  canvasPointerController.addResponder(fooResponder);

  expect(mockNothingIntersected.mock.calls).toHaveLength(0);

  canvasPointerController.begin();

  expect(mockNothingIntersected.mock.calls).toHaveLength(1);
});

it("reacts to intersections", function() {
  const mockMakeResponsive = jest.fn();
  const mockNothingIntersected = jest.fn();
  const mockRespond = jest.fn();
  const raycaster = new RaycasterMock([new THREE.Object3D()]);
  const scene = new THREE.Scene();
  const canvasPointerController = new CanvasPointerController(raycaster, scene);
  const fooResponder = new FooPointerResponder(mockMakeResponsive, mockNothingIntersected, mockRespond);

  canvasPointerController.addResponder(fooResponder);

  expect(mockMakeResponsive.mock.calls).toHaveLength(0);
  expect(mockNothingIntersected.mock.calls).toHaveLength(0);
  expect(mockRespond.mock.calls).toHaveLength(0);

  canvasPointerController.begin();

  expect(mockMakeResponsive.mock.calls).toHaveLength(1);
  expect(mockNothingIntersected.mock.calls).toHaveLength(0);
  expect(mockRespond.mock.calls).toHaveLength(1);
});
