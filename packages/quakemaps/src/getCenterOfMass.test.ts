import { Vector3 } from "three/src/math/Vector3";

import { getCenterOfMass } from "./getCenterOfMass";

test("finds center of mass", function () {
  const points = [new Vector3(0, 0, 0), new Vector3(0, 128, 0), new Vector3(128, 0, 0), new Vector3(128, 128, 0)];

  const centerOfMass = getCenterOfMass(points);

  expect(centerOfMass.equals(new Vector3(64, 64, 0))).toBe(true);
});
