import { MainLoop } from "./MainLoop";
import { SetTimeoutScheduler } from "./SetTimeoutScheduler";

test("loops until canceled", async function () {
  const mainLoop = MainLoop(SetTimeoutScheduler());

  let ticks = 0;

  await new Promise(function (resolve) {
    mainLoop.updatables.add({
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
