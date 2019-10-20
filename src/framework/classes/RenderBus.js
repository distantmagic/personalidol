// @flow

import type { ClockTick } from "../interfaces/ClockTick";
import type { RenderBus as RenderBusInterface } from "../interfaces/RenderBus";

export default class RenderBus implements RenderBusInterface {
  async tick(tick: ClockTick): Promise<void> {
  }
}
