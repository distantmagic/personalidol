import CancelToken from "src/framework/classes/CancelToken";
import CancelTokenQuery from "src/framework/classes/CancelTokenQuery";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Query from "src/framework/classes/Query";
import { default as CancelTokenException } from "src/framework/classes/Exception/CancelToken";

import { CancelToken as CancelTokenInterface } from "src/framework/interfaces/CancelToken";

class FooQuery extends Query<number> {
  execute(cancelToken: CancelTokenInterface): Promise<number> {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(4);
      });
    });
  }

  isEqual(other: FooQuery): boolean {
    return false;
  }
}

test("cannot be executed more than once", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const query = new FooQuery();
  const cancelTokenQuery = new CancelTokenQuery(loggerBreadcrumbs, cancelToken, query);

  expect(function() {
    cancelTokenQuery.execute();
    cancelTokenQuery.execute();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot get result before execution is finished", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const query = new FooQuery();
  const cancelTokenQuery = new CancelTokenQuery(loggerBreadcrumbs, cancelToken, query);

  expect(function() {
    cancelTokenQuery.execute();
    cancelTokenQuery.getResult();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot get result if query is not executed at all", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const query = new FooQuery();
  const cancelTokenQuery = new CancelTokenQuery(loggerBreadcrumbs, cancelToken, query);

  expect(function() {
    cancelTokenQuery.getResult();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot set result more than once", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const query = new FooQuery();
  const cancelTokenQuery = new CancelTokenQuery(loggerBreadcrumbs, cancelToken, query);

  cancelTokenQuery.setExecuted(4);

  expect(function() {
    cancelTokenQuery.setExecuted(5);
  }).toThrow(CancelTokenException);
}, 100);
