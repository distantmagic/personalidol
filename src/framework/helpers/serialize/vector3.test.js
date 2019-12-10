// @flow

import * as THREE from "three";

import vector3 from "./vector3";

test("serializes Vector3", function() {
  const vector = new THREE.Vector3(1, 2, 3);

  expect(vector3(vector)).toBe("[1,2,3]");
});
