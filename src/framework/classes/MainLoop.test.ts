import ControlToken from "src/framework/classes/ControlToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import Scheduler from "src/framework/classes/Scheduler";
import { default as MainLoopException } from "src/framework/classes/Exception/MainLoop";

import { default as IControlToken } from "src/framework/interfaces/ControlToken";

const loggerBreadcrumbs = new LoggerBreadcrumbs();
const mainLoop = MainLoop.getInstance(loggerBreadcrumbs);
const controlToken: IControlToken = mainLoop.getControllable().obtainControlToken();

function onBeforeAfter() {
  mainLoop.stop(controlToken);
  mainLoop.clear();
}

beforeEach(onBeforeAfter);

afterEach(onBeforeAfter);

test("is a singleton", function() {
  expect(function() {
    new MainLoop();
  }).toThrow(MainLoopException);
});

test("attaches scheduler", async function() {
  const mainLoop = MainLoop.getInstance(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);

  mainLoop.attachScheduler(scheduler);

  const promise = new Promise(function(resolve) {
    function endCallback(fps: number) {
      scheduler.offEnd(endCallback);
      resolve(fps);
    }

    scheduler.onEnd(endCallback);
  });

  mainLoop.start(controlToken);

  await expect(promise).resolves.toBeDefined();
}, 300);
