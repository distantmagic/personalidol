import CancelToken from "src/framework/classes/CancelToken";
import CancelTokenQuery from "src/framework/classes/CancelTokenQuery";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QueryBatch from "src/framework/classes/QueryBatch";
import { default as SilentLogger } from "src/framework/classes/Logger/Silent";

import Query from "src/framework/interfaces/Query";
import { default as ICancelToken } from "src/framework/interfaces/CancelToken";

type BarObject = {
  reference: number;
};

class Foo implements Query<number> {
  readonly fooReference: number;

  constructor(fooReference: number) {
    this.fooReference = fooReference;
  }

  async execute(cancelToken: ICancelToken): Promise<number> {
    return this.fooReference;
  }

  isEqual(other: Foo) {
    return this.fooReference === other.fooReference;
  }
}

class Bar implements Query<BarObject> {
  readonly barReference: BarObject;

  constructor(barReference: BarObject) {
    this.barReference = barReference;
  }

  async execute(cancelToken: ICancelToken): Promise<BarObject> {
    return this.barReference;
  }

  isEqual(other: Bar) {
    return this.barReference.reference === other.barReference.reference;
  }
}

test("it finds unique queries list", function() {
  const exceptionHandler = new ExceptionHandler(new SilentLogger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBatch = new QueryBatch(exceptionHandler, [
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(1)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(1)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(2)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(3)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(2)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(1)),
  ]);

  expect(queryBatch.getUnique()).toHaveLength(3);
});

test("it processes unique queries only", function() {
  const exceptionHandler = new ExceptionHandler(new SilentLogger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBatch = new QueryBatch(exceptionHandler, [
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(1)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(1)),
    new CancelTokenQuery(loggerBreadcrumbs, cancelToken, new Foo(2)),
    new CancelTokenQuery(
      loggerBreadcrumbs,
      cancelToken,
      new Bar({
        reference: 1,
      })
    ),
  ]);

  return queryBatch.process();
});
