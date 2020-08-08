import { Vector3 } from "three/src/math/Vector3";

import { sortPointsCounterClockwise } from "./sortPointsCounterClockwise";

import type { Vector3 as IVector3 } from "three";

type Fixture = {
  normal: IVector3;
  points: Array<IVector3>;
  expected: Array<IVector3>;
};

// prettier-ignore
test.each([
  [
    {
      normal: new Vector3(0, 0, 1),
      points: [
        new Vector3(1, 1, 0),
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
      ],
      expected: [
        new Vector3(1, 1, 0),
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
      ]
    }
  ]
])("sorts points counterclockwise", function (fixture: Fixture) {
  const sorted = sortPointsCounterClockwise(fixture.normal, fixture.points);

  expect(sorted).toHaveLength(fixture.expected.length);

  for (let i = 0; i < fixture.expected.length; i += 1) {
    expect(sorted[i].equals(fixture.expected[i])).toBe(true);
  }
});
