// @flow

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { FSMTransitionEventCallback } from "./FSMTransitionEventCallback";
import type { FSMTransitionEventSubscriber } from "./FSMTransitionEventSubscriber";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type FSMDefaultData<States, Transitions> = {|
  addEventListener: FSMTransitionEventSubscriber<States, Transitions>,
  addEventListenerAny: (FSMTransitionEventCallback<States, Transitions>) => void,
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  removeEventListener: FSMTransitionEventSubscriber<States, Transitions>,
  removeEventListenerAny: (FSMTransitionEventCallback<States, Transitions>) => void,
|};
