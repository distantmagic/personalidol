// @flow

import MainLoop from "./MainLoop";
import Scheduler from "./Scheduler";
import SingletonException from "./Exception/Singleton";

function onBeforeAfter() {
  const mainLoop = MainLoop.getInstance();

  mainLoop.stop();
  mainLoop.clear();
}

beforeEach(onBeforeAfter);

afterEach(onBeforeAfter);

it("is a singleton", function() {
  expect(function() {
    new MainLoop();
  }).toThrow(SingletonException);
});

it("attaches scheduler", async function() {
  const mainLoop = MainLoop.getInstance();
  const scheduler = new Scheduler();

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
