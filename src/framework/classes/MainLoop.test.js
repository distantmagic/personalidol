// @flow

import MainLoop from "./MainLoop";
import SingletonException from "./Exception/Singleton";

it("is a singleton", function() {
  expect(function() {
    new MainLoop();
  }).toThrow(SingletonException);
});

it("fires up loop events", function() {
  const mainLoop = MainLoop.getInstance();
});
