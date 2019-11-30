// @flow

import CancelToken from "./CancelToken";
import CancelTokenQuery from "./CancelTokenQuery";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBatch from "./QueryBatch";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { Query } from "../interfaces/Query";

type BarObject = {|
  reference: number,
|};

class Foo implements Query<number> {
  +fooReference: number;

  constructor(fooReference: number) {
    this.fooReference = fooReference;
  }

  async execute(cancelToken: CancelTokenInterface): Promise<number> {
    return this.fooReference;
  }

  isEqual(other: Foo) {
    return this.fooReference === other.fooReference;
  }
}

class Bar implements Query<BarObject> {
  +barReference: BarObject;

  constructor(barReference: BarObject) {
    this.barReference = barReference;
  }

  async execute(cancelToken: CancelTokenInterface): Promise<BarObject> {
    return this.barReference;
  }

  isEqual(other: Bar) {
    return this.barReference.reference === other.barReference.reference;
  }
}

test("it finds unique queries list", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBatch = new QueryBatch([
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
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBatch = new QueryBatch([
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
