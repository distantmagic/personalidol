import { ElementPositionUnit } from "src/framework/types/ElementPositionUnit";
import { HasElementPosition } from "src/framework/interfaces/HasElementPosition";
import { HasElementSize } from "src/framework/interfaces/HasElementSize";

export interface GeometryRectangle<Unit extends ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
