import { Vector3 } from "three/src/math/Vector3";

import { triangulateFacePoints } from "./triangulateFacePoints";

test("triangulates a set of points", function () {
  const faceNormal = new Vector3(0, 0, 1);

  // prettier-ignore
  const points = [
    new Vector3(1, 1, 0),
    new Vector3(0, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
  ];

  // prettier-ignore
  const expected = [
    [
      points[0],
      points[1],
      points[2],
    ],
    [
      points[0],
      points[2],
      points[3],
    ]
  ];

  const triangles = Array.from(triangulateFacePoints(faceNormal, points));

  expect(triangles).toHaveLength(expected.length);

  for (let i = 0; i < triangles.length; i += 1) {
    expect(triangles[i]).toHaveLength(3);

    for (let j = 0; j < triangles[i].length; j += 1) {
      expect(triangles[i][j]).toEqual(expected[i][j]);
    }
  }
});
