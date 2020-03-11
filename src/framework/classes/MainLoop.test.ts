import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import MainLoop from "src/framework/classes/MainLoop";
import Scheduler from "src/framework/classes/Scheduler";

import { default as IControlToken } from "src/framework/interfaces/ControlToken";

test("attaches scheduler", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const mainLoop = new MainLoop(loggerBreadcrumbs, scheduler);
  const controlToken: IControlToken = mainLoop.getControllable().obtainControlToken();

  const promise = new Promise(function(resolve) {
    function updateCallback(delta: number) {
      scheduler.update.delete(updateCallback);
      resolve(delta);
    }

    scheduler.update.add(updateCallback);
  });

  mainLoop.start(controlToken);

  await expect(promise).resolves.toBeDefined();
}, 300);
