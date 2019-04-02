// @flow

import MainLoop from "./MainLoop";
import SingletonException from "./Exception/Singleton";

it("is a singleton", () => {
  expect(function () {
    new MainLoop();
  }).toThrow(SingletonException);
});

it("fires up loop events", () => {
  const mainLoop = MainLoop.getInstance();
});
