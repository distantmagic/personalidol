import * as THREE from "three";

import CancelToken from "src/framework/classes/CancelToken";
import CancelTokenQuery from "src/framework/classes/CancelTokenQuery";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Query from "src/framework/classes/Query";
import { default as CancelTokenException } from "src/framework/classes/Exception/CancelToken";

import { default as ICancelToken } from "src/framework/interfaces/CancelToken";

class FooQuery extends Query<number> {
  private static uuid = THREE.MathUtils.generateUUID();

  execute(cancelToken: ICancelToken): Promise<number> {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(4);
      });
    });
  }

  getQueryUUID(): string {
    return FooQuery.uuid;
  }

  isEqual(other: FooQuery): boolean {
    return false;
  }
}

function createContext() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const query = new FooQuery();
  const cancelTokenQuery = new CancelTokenQuery(loggerBreadcrumbs, cancelToken, query);

  return {
    cancelTokenQuery: cancelTokenQuery,
  };
}

let context = createContext();

beforeEach(function() {
  context = createContext();
});

test("cannot be executed more than once", function() {
  expect(function() {
    context.cancelTokenQuery.execute();
    context.cancelTokenQuery.execute();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot get result before execution is finished", function() {
  expect(function() {
    context.cancelTokenQuery.execute();
    context.cancelTokenQuery.getResult();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot get result if query is not executed at all", function() {
  expect(function() {
    context.cancelTokenQuery.getResult();
  }).toThrow(CancelTokenException);
}, 100);

test("cannot set result more than once", function() {
  context.cancelTokenQuery.setExecuted(4);

  expect(function() {
    context.cancelTokenQuery.setExecuted(5);
  }).toThrow(CancelTokenException);
}, 100);
