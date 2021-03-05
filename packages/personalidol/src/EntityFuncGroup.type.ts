import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityFuncGroup = Geometry &
  Entity & {
    readonly classname: "func_group";
  };
