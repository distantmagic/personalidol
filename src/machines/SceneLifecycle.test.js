// @flow

import ExceptionHandler from "../framework/classes/ExceptionHandler";
import InvalidTransitionException from "../framework/classes/Exception/StateMachine/InvalidTransition";
import LoggerBreadcrumbs from "../framework/classes/LoggerBreadcrumbs";
import SceneLifecycle from "./SceneLifecycle";
import SilentLogger from "../framework/classes/SilentLogger";

it("keeps scene state", function() {
  const logger = new SilentLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandler = new ExceptionHandler(logger);
  const scene = new SceneLifecycle(exceptionHandler, loggerBreadcrumbs);

  const promise = new Promise(function(resolve) {
    function listener(evt) {
      scene.off("attaching", listener);
      resolve(evt.to);
    }

    scene.on("attaching", listener);
  });

  scene.attach();

  return expect(promise).resolves.toBe("attaching");
});

it("handles errors", function() {
  const logger = new SilentLogger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandler = new ExceptionHandler(logger);
  const scene = new SceneLifecycle(exceptionHandler, loggerBreadcrumbs);

  scene.attach();

  expect(function() {
    scene.attach();
  }).toThrow(InvalidTransitionException);
});
