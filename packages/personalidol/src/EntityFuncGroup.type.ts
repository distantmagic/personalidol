import type { Brush } from "@personalidol/quakemaps/src/Brush.type";
import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityFuncGroup = Geometry &
  Entity & {
    readonly brushes: Array<Brush>;
    readonly classname: "func_group";
  };
