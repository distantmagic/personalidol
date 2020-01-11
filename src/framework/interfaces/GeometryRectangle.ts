import { ElementPositionUnit } from "../types/ElementPositionUnit";
import { HasElementPosition } from "./HasElementPosition";
import { HasElementSize } from "./HasElementSize";

export interface GeometryRectangle<Unit extends ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
