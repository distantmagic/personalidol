import CancelToken from "src/framework/classes/CancelToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as CancelTokenException } from "src/framework/classes/Exception/CancelToken";

import cancelable from "src/framework/decorators/cancelable";

import { default as ICancelToken } from "src/framework/interfaces/CancelToken";

class Foo {
  private something: number;

  constructor(something: number) {
    this.something = something;
  }

  @cancelable()
  doSomething(cancelToken: ICancelToken, add: number): void {
    this.something = this.something + add;
  }

  @cancelable(true)
  doSomethingOrThrow(cancelToken: ICancelToken, add: number): void {
    this.doSomething(cancelToken, add);
  }

  getSomething(): number {
    return this.something;
  }
}

test("calls wrapped method if token is not canceled", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const foo = new Foo(4);

  foo.doSomething(cancelToken, 2);
  foo.doSomethingOrThrow(cancelToken, 2);

  expect(foo.getSomething()).toBe(8);
});

test("does not call wrapped method if token is already canceled", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const foo = new Foo(4);

  cancelToken.cancel(loggerBreadcrumbs);

  foo.doSomething(cancelToken, 2);

  expect(foo.getSomething()).toBe(4);

  expect(function() {
    foo.doSomethingOrThrow(cancelToken, 4);
  }).toThrow(CancelTokenException);
});
