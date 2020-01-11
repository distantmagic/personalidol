import BusClock from "../classes/BusClock";
import ClockReactiveController from "../classes/ClockReactiveController";
import Debugger from "../classes/Debugger";
import ExceptionHandler from "../classes/ExceptionHandler";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import QueryBus from "../classes/QueryBus";
import { default as ConsoleLogger } from "../classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "../classes/ExceptionHandlerFilter/Unexpected";

import { ClockReactiveController as ClockReactiveControllerInterface } from "../interfaces/ClockReactiveController";
import { Debugger as DebuggerInterface } from "../interfaces/Debugger";
import { ExceptionHandler as ExceptionHandlerInterface } from "../interfaces/ExceptionHandler";
import { Logger } from "../interfaces/Logger";
import { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

// prettier-ignore
type BootstrapFrameworkCallback<T> = (
  clockReactiveController: ClockReactiveControllerInterface,
  debug: DebuggerInterface,
  exceptionHandler: ExceptionHandlerInterface,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbsInterface,
  queryBus: QueryBusInterface,
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
