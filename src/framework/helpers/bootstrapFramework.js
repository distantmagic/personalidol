// @flow

import BusClock from "../classes/BusClock";
import ClockReactiveController from "../classes/ClockReactiveController";
import Debugger from "../classes/Debugger";
import ExceptionHandler from "../classes/ExceptionHandler";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import QueryBus from "../classes/QueryBus";
import { default as ConsoleLogger } from "../classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "../classes/ExceptionHandlerFilter/Unexpected";

import type { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";
import type { Debugger as DebuggerInterface } from "../interfaces/Debugger";
import type { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

// prettier-ignore
type BootstrapFrameworkCallback<T> = (
  ClockReactiveControllerInterface,
  DebuggerInterface,
  ExceptionHandlerInterface,
  Logger,
  LoggerBreadcrumbsInterface,
  QueryBusInterface,
) => T;

export default function bootstrapFramework<T>(bootstrapper: BootstrapFrameworkCallback<T>): T {
  const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker"]);
  const logger = new ConsoleLogger();

  const debug = new Debugger(loggerBreadcrumbs);

  const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);

  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs.add("QueryBus"));
  const clockReactiveController = new ClockReactiveController(BusClock.createForWorkerThread(), queryBus);

  // prettier-ignore
  return bootstrapper(
    clockReactiveController,
    debug,
    exceptionHandler,
    logger,
    loggerBreadcrumbs,
    queryBus,
  );
}
