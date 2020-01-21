import * as THREE from "three";

// prettier-ignore
type DebuggerStateValue =
  | ReadonlyArray<number | string>
  | THREE.Vector2
  | THREE.Vector3
  | number
  | string
;

export default DebuggerStateValue;
