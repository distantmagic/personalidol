import CancelToken from "src/framework/classes/CancelToken";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import LoadingManager from "src/framework/classes/LoadingManager";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";

test("determines whether loading is blocking or not", async function() {
  const logger = new ConsoleLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandlerFilter = new ExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
  const cancelToken1 = new CancelToken(loggerBreadcrumbs);
  const cancelToken2 = new CancelToken(loggerBreadcrumbs);
  const loadingManager = new LoadingManager(loggerBreadcrumbs, exceptionHandler);

  expect(loadingManager.getProgress()).toBe(1);

  loadingManager.blocking(cancelToken1.whenCanceled());

  expect(loadingManager.getProgress()).toBe(0);
  expect(loadingManager.getTotalLoading()).toBe(1);
  expect(loadingManager.isBackgroundLoading()).toBe(false);
  expect(loadingManager.isBlocking()).toBe(true);
  expect(loadingManager.isLoading()).toBe(true);

  loadingManager.background(cancelToken2.whenCanceled());

  expect(loadingManager.getProgress()).toBe(0);
  expect(loadingManager.getTotalLoading()).toBe(2);
  expect(loadingManager.isBackgroundLoading()).toBe(true);
  expect(loadingManager.isBlocking()).toBe(true);
  expect(loadingManager.isLoading()).toBe(true);

  cancelToken1.cancel(loggerBreadcrumbs);

  await cancelToken1.whenCanceled();

  expect(loadingManager.getProgress()).toBe(0.5);
  expect(loadingManager.getTotalLoading()).toBe(1);
  expect(loadingManager.isBackgroundLoading()).toBe(true);
  expect(loadingManager.isBlocking()).toBe(false);
  expect(loadingManager.isLoading()).toBe(true);

  cancelToken2.cancel(loggerBreadcrumbs);

  await cancelToken2.whenCanceled();

  expect(loadingManager.getProgress()).toBe(1);
  expect(loadingManager.getTotalLoading()).toBe(0);
  expect(loadingManager.isBackgroundLoading()).toBe(false);
  expect(loadingManager.isBlocking()).toBe(false);
  expect(loadingManager.isLoading()).toBe(false);
}, 300);

test("allows to embed comments", async function() {
  const logger = new ConsoleLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandlerFilter = new ExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const loadingManager = new LoadingManager(loggerBreadcrumbs, exceptionHandler);

  loadingManager.blocking(cancelToken.whenCanceled(), "test");
  loadingManager.blocking(cancelToken.whenCanceled(), "");
  loadingManager.blocking(cancelToken.whenCanceled());
  loadingManager.blocking(cancelToken.whenCanceled(), "test2");

  expect(loadingManager.getTotalLoading()).toBe(4);
  expect(loadingManager.isLoading()).toBe(true);

  const comments = loadingManager.getComments();

  expect(comments).toHaveLength(2);
  expect(comments).toEqual(["test", "test2"]);
}, 300);
