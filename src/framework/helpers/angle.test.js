// @flow

import * as angle from "./angle";
import ElementPosition from "../classes/ElementPosition";
import ElementRotation from "../classes/ElementRotation";

it("calculates radians angle between line going through two points and axis", function() {
  const elementPosition1 = new ElementPosition<"px">(0, 0, 0);
  const elementPosition2 = new ElementPosition<"px">(10, 10, 0);

  const correctRotation = new ElementRotation<"radians">(Math.PI / 2, Math.PI / 2, Math.PI / 4);
  const rotation = angle.theta(elementPosition1, elementPosition2);

  expect(rotation.isEqual(correctRotation)).toBe(true);
});
