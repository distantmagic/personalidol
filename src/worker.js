// @flow

// import ExceptionHandler from "./framework/classes/ExceptionHandler";
// import LoggerBreadcrumbs from "./framework/classes/LoggerBreadcrumbs";
// import { default as UnexpectedExceptionHandlerFilter } from "./framework/classes/ExceptionHandlerFilter/Unexpected";
// import { default as ConsoleLogger } from "./framework/classes/Logger/Console";

// const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
// const logger = new ConsoleLogger();
// const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
// const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker"]);

export async function hello(): Promise<string> {
  return "hello";
}
