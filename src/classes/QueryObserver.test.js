// @flow

import AlreadyRejected from "./Exception/QueryObserver/AlreadyRejected";
import AlreadyResolved from "./Exception/QueryObserver/AlreadyResolved";
import Query from "./Query";
import QueryObserver from "./QueryObserver";

declare var expect: any;
declare var it: any;

it("can't reject multiple times", () => {
  const query = new Query();
  const queryObserver = new QueryObserver<number>(query);

  queryObserver.reject(5);

  expect(queryObserver.await()).rejects.toBe(5);

  expect(() => {
    queryObserver.reject(6);
  }).toThrow(AlreadyRejected);
});

it("resolves query", () => {
  const query = new Query();
  const queryObserver = new QueryObserver<number>(query);

  queryObserver.resolve(5);

  expect(queryObserver.await()).resolves.toBe(5);
});

it("can't resolve multiple times", () => {
  const query = new Query();
  const queryObserver = new QueryObserver<number>(query);

  queryObserver.resolve(5);

  expect(() => {
    queryObserver.resolve(6);
  }).toThrow(AlreadyResolved);
});
