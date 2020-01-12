import * as THREE from "three";

import quake2three from "src/framework/helpers/quake2three";

test("converts Quake coordinates to THREE coordinates", function() {
  const v = new THREE.Vector3(1, 2, 3);

  expect(quake2three(v).equals(new THREE.Vector3(2, 3, 1))).toBe(true);

  // does not produce side effects
  expect(v.equals(new THREE.Vector3(1, 2, 3))).toBe(true);
});
