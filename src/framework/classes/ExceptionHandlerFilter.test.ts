import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import Logger from "src/framework/classes/Logger";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

class FooExceptionHandlerFilter extends ExceptionHandlerFilter {
  isCapturable(error: Error): boolean {
    return error instanceof RangeError;
  }
}

test.each([
  [new Error(), false],
  [new RangeError(), true],
])("decides which exceptions to report further", function(error: Error, expected: boolean) {
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandlerFilter = new FooExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);

  return expect(exceptionHandler.captureException(loggerBreadcrumbs, error)).resolves.toBe(expected);
});
