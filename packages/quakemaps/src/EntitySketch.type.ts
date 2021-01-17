import type { Brush } from "./Brush.type";
import type { EntityProperties } from "./EntityProperties.type";

export type EntitySketch = {
  brushes: Brush[];
  properties: EntityProperties;
};
