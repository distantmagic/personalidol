// @flow

import Scheduler from "./Scheduler";
import SchedulerBridge from "./SchedulerBridge";

import type { CanvasView } from "../interfaces/CanvasView";

class FixtureCanvasView implements CanvasView {
  begin(): void {
  }

  draw(interpolationPercentage: number): void {
  }

  end(fps: number, isPanicked: boolean): void {
  }

  update(delta: number): void {
  }
}

it("attaches and detaches canvas views to scheduler", function() {
  const scheduler = new Scheduler();
  const schedulerBridge = new SchedulerBridge(scheduler);
  const fixtureCanvasView = new FixtureCanvasView();

  schedulerBridge.forward(fixtureCanvasView);
  schedulerBridge.withdraw(fixtureCanvasView);
});
