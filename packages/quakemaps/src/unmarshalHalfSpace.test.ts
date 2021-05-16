import { Vector3 } from "three/src/math/Vector3";

import { unmarshalHalfSpace } from "./unmarshalHalfSpace";

import type { Vector3 as IVector3 } from "three";

test("half-plane string is unmarshaled", async function () {
  const parsed = unmarshalHalfSpace(
    "test",
    0,
    "   ( -64 -64 -16 )   ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty   0 0 0 1       1  "
  );

  expect(parsed).toEqual(
    expect.objectContaining({
      coplanarPoints: [
        { x: -64, y: -16, z: -64 },
        { x: -63, y: -16, z: -64 },
        { x: -64, y: -15, z: -64 },
      ],
      plane: {
        constant: -64,
        normal: {
          x: 0,
          y: 0,
          z: -1,
        },
      },
      points: [],
      texture: {
        name: "__TB_empty",
        offset: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 },
      },
    })
  );
});

test.each([
  ["( 0 0 0 ) ( 0 1 1 ) ( 0 1 0 ) __TB_empty 0 0 0 1 1", new Vector3(0, 0, 1)],
  ["( 0 0 0 ) ( 0 1 0 ) ( 0 1 1 ) __TB_empty 0 0 0 1 1", new Vector3(0, 0, -1)],

  ["( 0 0 0 ) ( 1 0 0 ) ( 1 0 1 ) __TB_empty 0 0 0 1 1", new Vector3(1, 0, 0)],
  ["( 1 0 1 ) ( 1 0 0 ) ( 0 0 0 ) __TB_empty 0 0 0 1 1", new Vector3(-1, 0, 0)],

  ["( 0 0 0 ) ( 0 1 0 ) ( 1 0 0 ) __TB_empty 0 0 0 1 1", new Vector3(0, 1, 0)],
  ["( 1 0 0 ) ( 0 1 0 ) ( 0 0 0 ) __TB_empty 0 0 0 1 1", new Vector3(0, -1, 0)],
])("properly determines the normal vector", function (halfSpace: string, expectedNormal: IVector3) {
  const parsed = unmarshalHalfSpace("test", 0, halfSpace);

  expect(parsed.plane.normal.equals(expectedNormal)).toBe(true);
});
