import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as SilentLogger } from "src/framework/classes/Logger/Silent";

class FooExceptionHandlerFilter extends ExceptionHandlerFilter {
  isCapturable(error: Error): boolean {
    return error instanceof RangeError;
  }
}

test("base class is usable", function () {
  const exceptionHandlerFilter = new ExceptionHandlerFilter();

  expect(exceptionHandlerFilter.isCapturable(new Error())).toBe(true);
});

test.each([
  [new Error(), false],
  [new RangeError(), true],
])("decides which exceptions to report further", function (error: Error, expected: boolean) {
  const logger = new SilentLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandlerFilter = new FooExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);

  return expect(exceptionHandler.captureException(loggerBreadcrumbs, error)).resolves.toBe(expected);
});
