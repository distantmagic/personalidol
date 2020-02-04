import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import HasElementPosition from "src/framework/interfaces/HasElementPosition";
import HasElementSize from "src/framework/interfaces/HasElementSize";

export default interface GeometryRectangle<Unit extends ElementPositionUnit> extends HasElementPosition<Unit>, HasElementSize<Unit> {}
