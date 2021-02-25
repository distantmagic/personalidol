import Loglevel from "loglevel";

import { MainLoop } from "./MainLoop";
import { MainLoopStatsHook } from "./MainLoopStatsHook";
import { SetTimeoutScheduler } from "./SetTimeoutScheduler";

test("loops until canceled", async function () {
  const logger = Loglevel.getLogger("test");
  const mainLoopStatsHook = MainLoopStatsHook();
  const mainLoop = MainLoop(logger, mainLoopStatsHook, SetTimeoutScheduler());

  let ticks = 0;

  await new Promise<void>(function (resolve) {
    mainLoop.updatables.add({
      state: {
        needsUpdates: true,
      },

      update(delta: number): void {
        ticks += 1;

        if (ticks === 5) {
          mainLoop.stop();
          resolve();
        }
      },
    });
    mainLoop.start();
  });

  expect(ticks).toBe(5);
});
