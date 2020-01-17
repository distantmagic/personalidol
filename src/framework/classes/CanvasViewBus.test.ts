import * as THREE from "three";

import CancelToken from "src/framework/classes/CancelToken";
import CanvasView from "src/framework/classes/CanvasView";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";
import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import { default as ICancelToken } from "src/framework/interfaces/CancelToken";
import { default as ICanvasViewBag } from "src/framework/interfaces/CanvasViewBag";

class FooCanvasView extends CanvasView {
  readonly useCallbacks: boolean;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, canvasViewBag: ICanvasViewBag, group: THREE.Group, useCallbacks: boolean) {
    super(loggerBreadcrumbs, canvasViewBag, group);

    this.useCallbacks = useCallbacks;
  }

  getName(): "Foo" {
    return "Foo";
  }

  useBegin() {
    return this.useCallbacks;
  }

  useDraw() {
    return this.useCallbacks;
  }

  useEnd() {
    return this.useCallbacks;
  }

  useUpdate() {
    return this.useCallbacks;
  }
}

class ImproperAttachFooCanvasView extends CanvasView {
  async attach(cancelToken: ICancelToken) {}

  getName(): "ImproperAttach" {
    return "ImproperAttach";
  }
}

class ImproperDisposeFooCanvasView extends CanvasView {
  async dispose(cancelToken: ICancelToken) {}

  getName(): "ImproperDispose" {
    return "ImproperDispose";
  }
}

test("cannot attach the same view more than once", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  const canvasView = new FooCanvasView(loggerBreadcrumbs, canvasViewBag, group, true);

  await canvasViewBus.add(cancelToken, canvasView);

  return expect(canvasViewBus.add(cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("cannot detach the same view more than once", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  const canvasView = new FooCanvasView(loggerBreadcrumbs, canvasViewBag, group, true);

  await canvasViewBus.add(cancelToken, canvasView);
  await canvasViewBus.delete(cancelToken, canvasView);

  return expect(canvasViewBus.delete(cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("fails when view attach is improperly implemented", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  const canvasView = new ImproperAttachFooCanvasView(loggerBreadcrumbs, canvasViewBag, group);

  return expect(canvasViewBus.add(cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("fails when view dispose is improperly implemented", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  const canvasView = new ImproperDisposeFooCanvasView(loggerBreadcrumbs, canvasViewBag, group);

  await canvasViewBus.add(cancelToken, canvasView);

  return expect(canvasViewBus.delete(cancelToken, canvasView)).rejects.toThrow(CanvasViewException);
});

test("properly attaches and detaches canvas views", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  // use callbacks
  const canvasViewCallbacks = new FooCanvasView(loggerBreadcrumbs, canvasViewBag, group, true);

  expect(canvasViewCallbacks.isAttached()).toBe(false);
  expect(canvasViewCallbacks.isDisposed()).toBe(false);

  await canvasViewBus.add(cancelToken, canvasViewCallbacks);

  expect(canvasViewCallbacks.isAttached()).toBe(true);
  expect(canvasViewCallbacks.isDisposed()).toBe(false);

  await canvasViewBus.delete(cancelToken, canvasViewCallbacks);

  expect(canvasViewCallbacks.isAttached()).toBe(false);
  expect(canvasViewCallbacks.isDisposed()).toBe(true);
});

test("properly attaches and detaches canvas views without callbacks", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);
  const group = new THREE.Group();

  // do not use callbacks
  const canvasViewNoCallbacks = new FooCanvasView(loggerBreadcrumbs, canvasViewBag, group, false);

  expect(canvasViewNoCallbacks.isAttached()).toBe(false);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(false);

  await canvasViewBus.add(cancelToken, canvasViewNoCallbacks);

  expect(canvasViewNoCallbacks.isAttached()).toBe(true);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(false);

  await canvasViewBus.delete(cancelToken, canvasViewNoCallbacks);

  expect(canvasViewNoCallbacks.isAttached()).toBe(false);
  expect(canvasViewNoCallbacks.isDisposed()).toBe(true);
});
