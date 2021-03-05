import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityWorldspawn = Entity &
  Geometry & {
    readonly classname: "worldspawn";
  };
