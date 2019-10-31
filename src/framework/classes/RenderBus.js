// @flow

import SchedulerBridge from "./SchedulerBridge";

import type { RenderBus as RenderBusInterface } from "../interfaces/RenderBus";
import type { Scheduler } from "../interfaces/Scheduler";
import type { SchedulerBridge as SchedulerBridgeInterface } from "../interfaces/SchedulerBridge";

export default class RenderBus implements RenderBusInterface {
  +scheduler: Scheduler;
  +schedulerBridge: SchedulerBridgeInterface;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this.schedulerBridge = new SchedulerBridge(this.scheduler);
  }
}
