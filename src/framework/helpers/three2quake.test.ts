import * as THREE from "three";

import quake2three from "./quake2three";
import three2quake from "./three2quake";

test("converts THREE coordinates to Quake coordinates", function() {
  const v = new THREE.Vector3(1, 2, 3);

  expect(three2quake(quake2three(v)).equals(new THREE.Vector3(1, 2, 3))).toBe(true);
});
