import type { Brush } from "@personalidol/quakemaps/src/Brush.type";
import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityWorldspawn = Entity &
  Geometry & {
    readonly brushes: Array<Brush>;
    readonly classname: "worldspawn";
  };
