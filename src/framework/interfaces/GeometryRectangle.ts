import HasElementPosition from "src/framework/interfaces/HasElementPosition";
import HasElementSize from "src/framework/interfaces/HasElementSize";

import ElementPositionUnit from "src/framework/types/ElementPositionUnit";

export default interface GeometryRectangle<Unit extends ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
