import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityScriptedZone = Geometry &
  Entity & {
    readonly classname: "scripted_zone";
    readonly controller: string;
  };
