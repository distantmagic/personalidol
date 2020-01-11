// @flow strict

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { HasElementPosition } from "./HasElementPosition";
import type { HasElementSize } from "./HasElementSize";

export interface GeometryRectangle<Unit: ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
