// @flow

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { FSMTransitionEventSubscriber } from "./FSMTransitionEventSubscriber";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type FSMDefaultData<States, Transitions> = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  off: FSMTransitionEventSubscriber<States, Transitions>,
  on: FSMTransitionEventSubscriber<States, Transitions>
|};
