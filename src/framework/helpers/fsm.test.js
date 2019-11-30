// @flow

import fsm from "./fsm";
import InvalidTransitionException from "../classes/Exception/StateMachine/InvalidTransition";
import Logger from "../classes/Logger";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";

type States = "gas" | "liquid" | "solid";

type Transitions = {|
  condense: () => void,
  freeze: () => void,
  melt: () => void,
  vaporize: () => void,
|};

const Phases = fsm<States, Transitions>({
  init: "solid",
  transitions: [
    { name: "melt", from: "solid", to: "liquid" },
    { name: "freeze", from: "liquid", to: "solid" },
    { name: "freeze", from: "solid", to: "solid" },
    { name: "vaporize", from: "liquid", to: "gas" },
    { name: "condense", from: "gas", to: "liquid" },
  ],
});

test("keeps state", async function() {
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const phases = new Phases(loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    function listener(evt) {
      phases.removeEventListener("liquid", listener);
      resolve(evt.to);
    }

    phases.addEventListener("liquid", listener);
  });

  phases.melt();

  await expect(promise).resolves.toBe("liquid");
});

test("handles errors", function() {
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const phases = new Phases(loggerBreadcrumbs);

  phases.melt();

  expect(function() {
    phases.melt();
  }).toThrow(InvalidTransitionException);
});

test("notifies about any kind of event", function() {
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const phases = new Phases(loggerBreadcrumbs);
  const transitions = [];

  function onAny(evt) {
    transitions.push([evt.from, evt.to]);
  }

  phases.addEventListenerAny(onAny);

  phases.melt();
  phases.vaporize();

  phases.removeEventListenerAny(onAny);

  phases.condense();

  expect(transitions).toEqual([
    ["solid", "liquid"],
    ["liquid", "gas"],
  ]);
});

test("does not notify when state is not changed", function() {
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const phases = new Phases(loggerBreadcrumbs);
  const transitions = [];

  function onAny(evt) {
    transitions.push([evt.from, evt.to]);
  }

  phases.addEventListenerAny(onAny);

  phases.freeze();

  expect(transitions).toEqual([]);
});
