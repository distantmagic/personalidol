import CancelToken from "src/framework/classes/CancelToken";
import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import Logger from "src/framework/classes/Logger";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QueryBus from "src/framework/classes/QueryBus";

import { CancelToken as CancelTokenInterface } from "src/framework/interfaces/CancelToken";
import { Query } from "src/framework/interfaces/Query";

type Total = {
  executed: number;
};

class Foo implements Query<number> {
  readonly id: number;
  readonly reference: number;
  readonly total: Total;

  constructor(total: Total, reference: number, id: number) {
    this.id = id;
    this.reference = reference;
    this.total = total;
  }

  async execute(cancelToken: CancelTokenInterface): Promise<number> {
    this.total.executed += 1;

    return this.reference;
  }

  isEqual(other: Foo) {
    return this.reference === other.reference;
  }
}

test("executes similar queries only once", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const exceptionHandler = new ExceptionHandler(new Logger(), new ExceptionHandlerFilter());
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const total: Total = {
    executed: 0,
  };

  const promises = Promise.all([
    queryBus.enqueue(cancelToken, new Foo(total, 1, 1)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 1, 2)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 2, 3)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 3, 4)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 4, 5)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 4, 6)).whenExecuted(),
    queryBus.enqueue(cancelToken, new Foo(total, 4, 7)).whenExecuted(),
  ]);

  queryBus.tick();

  const results = await promises;

  expect(total.executed).toBe(4);
  expect(results).toEqual([1, 1, 2, 3, 4, 4, 4]);
}, 300);
