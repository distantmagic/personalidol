import BusClock from "src/framework/classes/BusClock";
import ClockReactiveController from "src/framework/classes/ClockReactiveController";
import Debugger from "src/framework/classes/Debugger";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QueryBus from "src/framework/classes/QueryBus";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "src/framework/classes/ExceptionHandlerFilter/Unexpected";

import Logger from "src/framework/interfaces/Logger";
import { default as IClockReactiveController } from "src/framework/interfaces/ClockReactiveController";
import { default as IDebugger } from "src/framework/interfaces/Debugger";
import { default as IExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IQueryBus } from "src/framework/interfaces/QueryBus";

// prettier-ignore
type BootstrapFrameworkCallback<T> = (
  clockReactiveController: IClockReactiveController,
  debug: IDebugger,
  exceptionHandler: IExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: ILoggerBreadcrumbs,
  queryBus: IQueryBus,
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
