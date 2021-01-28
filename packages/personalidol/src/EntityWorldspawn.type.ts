import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityWorldspawn = Geometry &
  BaseEntity & {
    readonly classname: "worldspawn";
  };
