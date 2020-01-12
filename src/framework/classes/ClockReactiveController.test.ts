import BusClock from "src/framework/classes/BusClock";
import CancelToken from "src/framework/classes/CancelToken";
import ClockReactiveController from "src/framework/classes/ClockReactiveController";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import Logger from "src/framework/classes/Logger";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QueryBus from "src/framework/classes/QueryBus";

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
