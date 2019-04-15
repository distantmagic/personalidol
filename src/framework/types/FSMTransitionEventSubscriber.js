// @flow

import type { FSMTransitionEventCallback } from "./FSMTransitionEventCallback";

export type FSMTransitionEventSubscriber<States, Transitions> = (
  States & string,
  FSMTransitionEventCallback<States, Transitions>
) => void;
