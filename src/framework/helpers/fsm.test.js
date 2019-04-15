// @flow

import ExceptionHandler from "../classes/ExceptionHandler";
import fsm from "./fsm";
import InvalidTransitionException from "../classes/Exception/StateMachine/InvalidTransition";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import SilentLogger from "../classes/SilentLogger";

type States = "gas" | "liquid" | "solid";

type Transitions = {|
  condense: () => void,
  freeze: () => void,
  melt: () => void,
  vaporize: () => void
|};

const Phases = fsm<States, Transitions>({
  init: "solid",
  transitions: [
    { name: "melt", from: "solid", to: "liquid" },
    { name: "freeze", from: "liquid", to: "solid" },
    { name: "vaporize", from: "liquid", to: "gas" },
    { name: "condense", from: "gas", to: "liquid" }
  ]
});

it("keeps state", function() {
  const logger = new SilentLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandler = new ExceptionHandler(logger);
  const phases = new Phases(exceptionHandler, loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    function listener(evt) {
      phases.off("liquid", listener);
      resolve(evt.to);
    }

    phases.on("liquid", listener);
  });

  phases.melt();

  return expect(promise).resolves.toBe("liquid");
});

it("handles errors", function() {
  const logger = new SilentLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandler = new ExceptionHandler(logger);
  const phases = new Phases(exceptionHandler, loggerBreadcrumbs);

  phases.melt();

  expect(function() {
    phases.melt();
  }).toThrow(InvalidTransitionException);
});
