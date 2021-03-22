import { Vector2 } from "three/src/math/Vector2";

import { computePointerStretchVector } from "./computePointerStretchVector";

test("computes stretch vector", function () {
  const target = new Vector2(0, 0);

  computePointerStretchVector(target, 0, 100, 0, 0, 100);

  expect(target.x).toBe(1);
  expect(target.y).toBe(-0);
});
