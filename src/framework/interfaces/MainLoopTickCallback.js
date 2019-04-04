// @flow

import type { ClockTick } from "./ClockTick";

export type MainLoopTickCallback = ClockTick => void | Promise<void>;
