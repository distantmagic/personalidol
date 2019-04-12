// @flow

import CancelToken from "./CancelToken";
import QueryBus from "./QueryBus";
import TimeoutTick from "./TimeoutTick";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { Query } from "../interfaces/Query";

type Total = {
  executed: number
};

class Foo implements Query<number> {
  +reference: number;
  +total: Total;

  constructor(total: Total, reference: number) {
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

it("executes similar queries only once", async function() {
  const cancelToken = new CancelToken();
  const queryBus = new QueryBus();
  const total: Total = {
    executed: 0
  };

  const promises = Promise.all([
    queryBus.enqueue(cancelToken, new Foo(total, 1)),
    queryBus.enqueue(cancelToken, new Foo(total, 1)),
    queryBus.enqueue(cancelToken, new Foo(total, 2)),
    queryBus.enqueue(cancelToken, new Foo(total, 3)),
    queryBus.enqueue(cancelToken, new Foo(total, 4)),
    queryBus.enqueue(cancelToken, new Foo(total, 4)),
    queryBus.enqueue(cancelToken, new Foo(total, 4))
  ]);

  queryBus.tick(new TimeoutTick(false));

  const results = await promises;

  expect(total.executed).toBe(4);
  expect(results).toEqual([1, 1, 2, 3, 4, 4, 4]);
});
