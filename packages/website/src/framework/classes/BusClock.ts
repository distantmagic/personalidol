import autoBind from "auto-bind";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type { default as IBusClock } from "src/framework/interfaces/BusClock";

import type BusClockCallback from "src/framework/types/BusClockCallback";

export default class BusClock implements IBusClock {
  private callback: null | BusClockCallback = null;
  private callInterval: number;
  private ticksInterval: number = 0;

  constructor(callInterval: number = 4) {
    autoBind(this);

    this.callInterval = callInterval;
  }

  @cancelable()
  async interval(cancelToken: CancelToken, callback: BusClockCallback): Promise<void> {
    this.callback = callback;

    await cancelToken.whenCanceled();

    this.callback = null;
  }

  update(delta: number): void {
    const callback = this.callback;

    this.ticksInterval += 1;

    if (callback && this.ticksInterval >= this.callInterval) {
      this.ticksInterval = 0;
      callback();
    }
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
