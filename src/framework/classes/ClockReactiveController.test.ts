import BusClock from "./BusClock";
import CancelToken from "./CancelToken";
import ClockReactiveController from "./ClockReactiveController";
import ExceptionHandler from "./ExceptionHandler";
import ExceptionHandlerFilter from "./ExceptionHandlerFilter";
import Logger from "./Logger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";

test("supports cancel token", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const clock = new BusClock(10000);
  const exceptionHandler = new ExceptionHandler(new Logger(), new ExceptionHandlerFilter());
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const controller = new ClockReactiveController(clock, queryBus);

  setTimeout(function() {
    cancelToken.cancel(loggerBreadcrumbs.add("setTimeout"));
  });

  return controller.interval(cancelToken);
}, 100);
