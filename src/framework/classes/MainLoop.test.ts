// @flow strict

import MainLoop from "./MainLoop";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import Scheduler from "./Scheduler";
import SingletonException from "./Exception/Singleton";

function onBeforeAfter() {
  const mainLoop = MainLoop.getInstance();

  mainLoop.stop();
  mainLoop.clear();
}

beforeEach(onBeforeAfter);

afterEach(onBeforeAfter);

test("is a singleton", function() {
  expect(function() {
    new MainLoop();
  }).toThrow(SingletonException);
});

test("attaches scheduler", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const mainLoop = MainLoop.getInstance();
  const scheduler = new Scheduler(loggerBreadcrumbs);

  mainLoop.attachScheduler(scheduler);

  const promise = new Promise(function(resolve) {
    function endCallback(fps) {
      scheduler.offEnd(endCallback);
      resolve(fps);
    }

    scheduler.onEnd(endCallback);
  });

  mainLoop.start();

  await expect(promise).resolves.toBeDefined();
}, 300);
