// @flow

import type { FSMTransitionEventCallback } from "./FSMTransitionEventCallback";
import type { FSMTransitionEventSubscriber } from "./FSMTransitionEventSubscriber";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type FSMDefaultData<States, Transitions> = {|
  addEventListener: FSMTransitionEventSubscriber<States, Transitions>,
  addEventListenerAny: (FSMTransitionEventCallback<States, Transitions>) => void,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  removeEventListener: FSMTransitionEventSubscriber<States, Transitions>,
  removeEventListenerAny: (FSMTransitionEventCallback<States, Transitions>) => void,
|};
