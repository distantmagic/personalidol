// @flow strict

import type { Vector2, Vector3 } from "three";

export type DebuggerStateValue = $ReadOnlyArray<number | string> | Vector2 | Vector3 | number | string;
