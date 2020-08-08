import { Vector3 } from "three/src/math/Vector3";

import { getIntersectingPoint } from "./getIntersectingPoint";
import { unmarshalHalfSpace } from "./unmarshalHalfSpace";

test("finds intersecting point", function () {
  const hs1 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1");
  const hs2 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1");
  const hs3 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1");

  const pointsCache = {};
  const intersection = getIntersectingPoint(hs1, hs2, hs3, pointsCache);

  expect(intersection).not.toBe(null);

  if (intersection) {
    expect(intersection.equals(new Vector3(-64, -16, -64))).toBe(true);
  }
});

test("reuses points", function () {
  const hs1 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -64 -63 -16 ) ( -64 -64 -15 ) __TB_empty 0 0 0 1 1");
  const hs2 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -64 -64 -15 ) ( -63 -64 -16 ) __TB_empty 0 0 0 1 1");
  const hs3 = unmarshalHalfSpace("test", 0, "( -64 -64 -16 ) ( -63 -64 -16 ) ( -64 -63 -16 ) __TB_empty 0 0 0 1 1");

  const pointsCache = {};

  const is1 = getIntersectingPoint(hs1, hs2, hs3, pointsCache);
  const is2 = getIntersectingPoint(hs1, hs2, hs3, pointsCache);

  expect(is1).toBe(is2);
});
