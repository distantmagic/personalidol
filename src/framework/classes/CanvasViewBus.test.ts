import * as THREE from "three";

import CameraFrustumBus from "src/framework/classes/CameraFrustumBus";
import CancelToken from "src/framework/classes/CancelToken";
import CanvasView from "src/framework/classes/CanvasView";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import PhysicsWorld from "src/framework/classes/PhysicsWorld";
import Scheduler from "src/framework/classes/Scheduler";
import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type { default as ICancelToken } from "src/framework/interfaces/CancelToken";
import type { default as ICanvasViewBag } from "src/framework/interfaces/CanvasViewBag";

class FooCanvasView extends CanvasView {
  readonly useCallbacks: SchedulerUpdateScenario;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: ICanvasViewBag, group: THREE.Group, useCallbacks: SchedulerUpdateScenario) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.useCallbacks = useCallbacks;
  }

  useUpdate() {
    return this.useCallbacks;
  }
}

class ImproperAttachFooCanvasView extends CanvasView {
  async attach(cancelToken: ICancelToken) {}
}

class ImproperDisposeFooCanvasView extends CanvasView {
  async dispose(cancelToken: ICancelToken) {}
}

function createContext() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const physicsWorld = new PhysicsWorld(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const camera = new THREE.PerspectiveCamera();
  const cameraFrustumBus = new CameraFrustumBus(loggerBreadcrumbs, camera);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, cameraFrustumBus, physicsWorld, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs, canvasViewBus);
  const group = new THREE.Group();

  return {
    cancelToken: cancelToken,
    canvasViewBag: canvasViewBag,
    canvasViewBus: canvasViewBus,
    group: group,
    loggerBreadcrumbs: loggerBreadcrumbs,
  };
}

let context = createContext();

beforeEach(function () {
  context = createContext();
});

test("cannot attach the same view more than once", async function () {
  const canvasView = new FooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group, SchedulerUpdateScenario.Always);

  await context.canvasViewBus.add(context.cancelToken, canvasView);

  return expect(context.canvasViewBus.add(context.cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("cannot detach the same view more than once", async function () {
  const canvasView = new FooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group, SchedulerUpdateScenario.Always);

  await context.canvasViewBus.add(context.cancelToken, canvasView);
  await context.canvasViewBus.delete(context.cancelToken, canvasView);

  return expect(context.canvasViewBus.delete(context.cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("fails when view attach is improperly implemented", async function () {
  const canvasView = new ImproperAttachFooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group);

  return expect(context.canvasViewBus.add(context.cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("fails when view dispose is improperly implemented", async function () {
  const canvasView = new ImproperDisposeFooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group);

  await context.canvasViewBus.add(context.cancelToken, canvasView);

  return expect(context.canvasViewBus.delete(context.cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("properly attaches and detaches canvas views", async function () {
  // use callbacks
  const canvasViewCallbacks = new FooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group, SchedulerUpdateScenario.Always);

  expect(canvasViewCallbacks.isAttached()).toBe(false);
  expect(canvasViewCallbacks.isDisposed()).toBe(false);

  await context.canvasViewBus.add(context.cancelToken, canvasViewCallbacks);

  expect(canvasViewCallbacks.isAttached()).toBe(true);
  expect(canvasViewCallbacks.isDisposed()).toBe(false);

  await context.canvasViewBus.delete(context.cancelToken, canvasViewCallbacks);

  expect(canvasViewCallbacks.isAttached()).toBe(false);
  expect(canvasViewCallbacks.isDisposed()).toBe(true);
});

test("properly attaches and detaches canvas views without callbacks", async function () {
  // do not use callbacks
  const canvasViewNoCallbacks = new FooCanvasView(context.loggerBreadcrumbs, context.canvasViewBag, context.group, SchedulerUpdateScenario.Never);

  expect(canvasViewNoCallbacks.isAttached()).toBe(false);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(false);

  await context.canvasViewBus.add(context.cancelToken, canvasViewNoCallbacks);

  expect(canvasViewNoCallbacks.isAttached()).toBe(true);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(false);

  await context.canvasViewBus.delete(context.cancelToken, canvasViewNoCallbacks);

  expect(canvasViewNoCallbacks.isAttached()).toBe(false);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(true);
});
