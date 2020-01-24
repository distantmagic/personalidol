import findControllable from "src/framework/helpers/findControllable";

import Controllable from "src/framework/classes/Controllable";
import ControlToken from "src/framework/classes/ControlToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as ControlTokenException } from "src/framework/classes/Exception/ControlToken";

import controlled from "src/framework/decorators/controlled";

import ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";
import { default as ILoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

class FooControllable extends Controllable {
  private initial: number;

  constructor(loggerBreadcrumbs: ILoggerBreadcrumbs, initial: number) {
    super(loggerBreadcrumbs);

    this.initial = initial;
  }

  @controlled()
  doSomething(controlToken: IControlToken, add: number): number {
    return this.initial + add;
  }
}

class FooControllableDelegate implements ControllableDelegate {
  private readonly controllable: IControllable;
  private readonly internalControlToken: IControlToken;
  private initial: number;

  constructor(loggerBreadcrumbs: ILoggerBreadcrumbs, initial: number) {
    this.internalControlToken = new ControlToken(loggerBreadcrumbs);
    this.controllable = new Controllable(loggerBreadcrumbs, this.internalControlToken);
    this.initial = initial;
  }

  @controlled(true)
  doSomething(controlToken: IControlToken, add: number): number {
    // normally you should use 'controlToken' here, it's just for testing
    return this.getInitial(this.internalControlToken) + add;
  }

  getControllable(): IControllable {
    return this.controllable;
  }

  @controlled(true)
  getInitial(controlToken: IControlToken): number {
    return this.initial;
  }
}

describe.each([
  ["Controllable", FooControllable, false],
  ["ControllableDelegate", FooControllableDelegate, true],
])('handles method protection (for consistency, not security) with control token: "%s"', function(klass: string, Constructor, isDelegate: boolean) {
  test("succeeds with correct control token", function() {
    const loggerBreadcrumbs = new LoggerBreadcrumbs();
    const foo = new Constructor(loggerBreadcrumbs, 1);
    const controllable = findControllable(loggerBreadcrumbs, isDelegate, foo);
    const controlToken = controllable.obtainControlToken();

    expect(foo.doSomething(controlToken, 2)).toBe(3);
  });

  test("can obtain and cede control token", function() {
    const loggerBreadcrumbs = new LoggerBreadcrumbs();
    const foo = new Constructor(loggerBreadcrumbs, 4);
    const controllable = findControllable(loggerBreadcrumbs, isDelegate, foo);

    const controlToken1 = controllable.obtainControlToken();

    expect(foo.doSomething(controlToken1, 5)).toBe(9);

    controllable.cedeExternalControlToken(controlToken1);

    const controlToken2 = controllable.obtainControlToken();

    expect(function() {
      foo.doSomething(controlToken1, 5);
    }).toThrow(ControlTokenException);

    expect(foo.doSomething(controlToken2, 6)).toBe(10);
  });

  test("fails when no incorrect control token is used", function() {
    const loggerBreadcrumbs = new LoggerBreadcrumbs();
    const foo = new Constructor(loggerBreadcrumbs, 6);
    const controllable = findControllable(loggerBreadcrumbs, isDelegate, foo);
    const controlToken = controllable.obtainControlToken();
    const invalidControlToken = new ControlToken(loggerBreadcrumbs);

    expect(function() {
      foo.doSomething(invalidControlToken, 7);
    }).toThrow(ControlTokenException);
  });
});
