// @flow

import * as THREE from "three";

import serializeVector3 from "./serializeVector3";

test("serializes Vector3", function() {
  const vector = new THREE.Vector3(1, 2, 3);

  expect(serializeVector3(vector)).toBe("[1,2,3]");
});
