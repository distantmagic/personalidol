import ExceptionHandler from "./ExceptionHandler";
import ExceptionHandlerFilter from "./ExceptionHandlerFilter";
import Logger from "./Logger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

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
