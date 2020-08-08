import { Vector3 } from "three/src/math/Vector3";

import { marshalVector3 } from "./marshalVector3";

test("marshals Vector3 into string", function () {
  const vector3 = new Vector3(-32, 40, 16);

  expect(marshalVector3(vector3)).toBe("16 -32 40");
});
