import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityFuncGroup = Geometry &
  BaseEntity & {
    readonly classname: "func_group";
  };
