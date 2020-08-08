import { rules as gameoflife } from "@personalidol/gameoflife-ruleset-conway/src/index";
import { tick } from "./tick";

// prettier-ignore
test("the next blinker step is calculated", function () {
  const nextState = tick(gameoflife, 3, 3, [
    0, 0, 0,
    1, 1, 1,
    0, 0, 0,
  ]);

  expect(nextState).toEqual([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  ]);
});

// prettier-ignore
test("the next 5-row steps are calculated", function () {
  const gof = tick.bind(null, gameoflife, 5, 7);

  const nextState1 = gof([
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]);

  expect(nextState1).toEqual([
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ]);

  const nextState2 = gof(nextState1);

  expect(nextState2).toEqual([
    0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 0, 1, 0, 0,
    0, 1, 0, 0, 0, 1, 0,
    0, 0, 1, 0, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0,
  ]);
});
