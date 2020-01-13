import CancelToken from "src/framework/classes/CancelToken";
import CanvasController from "src/framework/classes/CanvasController";
import CanvasControllerBus from "src/framework/classes/CanvasControllerBus";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import HTMLElementResizeObserver from "src/framework/classes/HTMLElementResizeObserver";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";
import { default as CanvasControllerException } from "src/framework/classes/Exception/CanvasController";

import { CanvasViewBag as CanvasViewBagInterface } from "src/framework/interfaces/CanvasViewBag";

class FooCanvasController extends CanvasController {
  readonly useCallbacks: boolean;

  constructor(canvasViewBag: CanvasViewBagInterface, useCallbacks: boolean) {
    super(canvasViewBag);

    this.useCallbacks = useCallbacks;
  }

  useBegin(): boolean {
    return this.useCallbacks;
  }

  useDraw(): boolean {
    return this.useCallbacks;
  }

  useEnd(): boolean {
    return this.useCallbacks;
  }

  useUpdate(): boolean {
    return this.useCallbacks;
  }
}

class ImproperAttachCanvasController extends CanvasController {
  async attach(cancelToken: CancelToken): Promise<void> {}
}

class ImproperDisposeCanvasController extends CanvasController {
  async dispose(cancelToken: CancelToken): Promise<void> {}
}

test("cannot attach the same controller more than once", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const htmlElement = document.createElement("div");
  const htmlElementResizeObserver = new HTMLElementResizeObserver(loggerBreadcrumbs, htmlElement);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, htmlElementResizeObserver, scheduler);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);

  const canvasController = new FooCanvasController(canvasViewBag, true);

  await canvasControllerBus.add(cancelToken, canvasController);

  return expect(canvasControllerBus.add(cancelToken, canvasController)).rejects.toThrow(CanvasControllerException);
});

test("cannot detach the same controller more than once", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const htmlElement = document.createElement("div");
  const htmlElementResizeObserver = new HTMLElementResizeObserver(loggerBreadcrumbs, htmlElement);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, htmlElementResizeObserver, scheduler);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);

  const canvasController = new FooCanvasController(canvasViewBag, false);

  await canvasControllerBus.add(cancelToken, canvasController);
  await canvasControllerBus.delete(cancelToken, canvasController);

  return expect(canvasControllerBus.delete(cancelToken, canvasController)).rejects.toThrow(CanvasControllerException);
});

test("fails when controller attach is improperly implemented", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const htmlElement = document.createElement("div");
  const htmlElementResizeObserver = new HTMLElementResizeObserver(loggerBreadcrumbs, htmlElement);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, htmlElementResizeObserver, scheduler);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);

  const canvasController = new ImproperAttachCanvasController(canvasViewBag);

  return expect(canvasControllerBus.add(cancelToken, canvasController)).rejects.toThrow(CanvasControllerException);
});

test("fails when controller dispose is improperly implemented", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const htmlElement = document.createElement("div");
  const htmlElementResizeObserver = new HTMLElementResizeObserver(loggerBreadcrumbs, htmlElement);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, htmlElementResizeObserver, scheduler);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);

  const canvasController = new ImproperDisposeCanvasController(canvasViewBag);

  await canvasControllerBus.add(cancelToken, canvasController);

  return expect(canvasControllerBus.delete(cancelToken, canvasController)).rejects.toThrow(CanvasControllerException);
});

test("properly attaches and detaches canvas controllers", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const htmlElement = document.createElement("div");
  const htmlElementResizeObserver = new HTMLElementResizeObserver(loggerBreadcrumbs, htmlElement);
  const canvasControllerBus = new CanvasControllerBus(loggerBreadcrumbs, htmlElementResizeObserver, scheduler);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(canvasViewBus, loggerBreadcrumbs);

  const canvasController = new FooCanvasController(canvasViewBag, true);

  expect(canvasController.isAttached()).toBe(false);
  expect(canvasController.isDisposed()).toBe(false);

  await canvasControllerBus.add(cancelToken, canvasController);

  expect(canvasController.isAttached()).toBe(true);
  expect(canvasController.isDisposed()).toBe(false);

  await canvasControllerBus.delete(cancelToken, canvasController);

  expect(canvasController.isAttached()).toBe(false);
  expect(canvasController.isDisposed()).toBe(true);
});
