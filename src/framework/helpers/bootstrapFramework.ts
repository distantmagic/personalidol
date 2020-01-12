import BusClock from "src/framework/classes/BusClock";
import ClockReactiveController from "src/framework/classes/ClockReactiveController";
import Debugger from "src/framework/classes/Debugger";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QueryBus from "src/framework/classes/QueryBus";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "src/framework/classes/ExceptionHandlerFilter/Unexpected";

import { ClockReactiveController as ClockReactiveControllerInterface } from "src/framework/interfaces/ClockReactiveController";
import { Debugger as DebuggerInterface } from "src/framework/interfaces/Debugger";
import { ExceptionHandler as ExceptionHandlerInterface } from "src/framework/interfaces/ExceptionHandler";
import { Logger } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QueryBus as QueryBusInterface } from "src/framework/interfaces/QueryBus";

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
