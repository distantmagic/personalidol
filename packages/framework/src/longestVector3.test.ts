import { Vector3 } from "three/src/math/Vector3";

import { longestVector3 } from "./longestVector3";

test("picks a longest vector from the list of vectors", function () {
  const v1 = new Vector3(0, 0, 0);
  const v2 = new Vector3(10, 0, 0);
  const v3 = new Vector3(8, 8, 0);
  const v4 = new Vector3(0, -10, 0);

  expect(longestVector3(v1, v2, v3, v4)).toBe(v3);
});
