import CancelToken from "./CancelToken";
import ExceptionHandler from "./ExceptionHandler";
import ExceptionHandlerFilter from "./ExceptionHandlerFilter";
import LoadingManager from "./LoadingManager";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import { default as ConsoleLogger } from "./Logger/Console";

test("determines whether loading is blocking or not", async function() {
  const logger = new ConsoleLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandlerFilter = new ExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
  const cancelToken1 = new CancelToken(loggerBreadcrumbs);
  const cancelToken2 = new CancelToken(loggerBreadcrumbs);
  const loadingManager = new LoadingManager(loggerBreadcrumbs, exceptionHandler);

  loadingManager.blocking(cancelToken1.whenCanceled());

  let loadingManagerState = loadingManager.getState();
  expect(loadingManagerState.getTotalLoading()).toBe(1);
  expect(loadingManagerState.isBackgroundLoading()).toBe(false);
  expect(loadingManagerState.isBlocking()).toBe(true);
  expect(loadingManagerState.isLoading()).toBe(true);

  loadingManager.background(cancelToken2.whenCanceled());

  loadingManagerState = loadingManager.getState();
  expect(loadingManagerState.getTotalLoading()).toBe(2);
  expect(loadingManagerState.isBackgroundLoading()).toBe(true);
  expect(loadingManagerState.isBlocking()).toBe(true);
  expect(loadingManagerState.isLoading()).toBe(true);

  cancelToken1.cancel(loggerBreadcrumbs);
  await cancelToken1.whenCanceled();

  loadingManagerState = loadingManager.getState();
  expect(loadingManagerState.getTotalLoading()).toBe(1);
  expect(loadingManagerState.isBackgroundLoading()).toBe(true);
  expect(loadingManagerState.isBlocking()).toBe(false);
  expect(loadingManagerState.isLoading()).toBe(true);

  cancelToken2.cancel(loggerBreadcrumbs);
  await cancelToken2.whenCanceled();

  loadingManagerState = loadingManager.getState();
  expect(loadingManagerState.getTotalLoading()).toBe(0);
  expect(loadingManagerState.isBackgroundLoading()).toBe(false);
  expect(loadingManagerState.isBlocking()).toBe(false);
  expect(loadingManagerState.isLoading()).toBe(false);
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

  let loadingManagerState = loadingManager.getState();

  expect(loadingManagerState.getTotalLoading()).toBe(4);
  expect(loadingManagerState.isLoading()).toBe(true);

  const comments = loadingManagerState.getComments();

  expect(comments).toHaveLength(2);
  expect(comments).toEqual(["test", "test2"]);
}, 300);
