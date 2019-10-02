// @flow

import type { ElementPositionUnit } from "../types/ElementPositionUnit";
import type { GeometryRectangle } from "./GeometryRectangle";

export interface ElementBoundingBox<Unit: ElementPositionUnit> extends GeometryRectangle<Unit> {}
