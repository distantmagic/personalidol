import { Vector3 } from "three/src/math/Vector3";

import { unmarshalVector3 } from "./unmarshalVector3";

test("vector3 is unmarshaled", async function () {
  const parsed = unmarshalVector3("test", 0, "  16 -32       40   ");

  expect(parsed.equals(new Vector3(-32, 40, 16))).toBe(true);
});
