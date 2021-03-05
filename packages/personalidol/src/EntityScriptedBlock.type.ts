import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { Entity } from "./Entity.type";

export type EntityScriptedBlock = Geometry &
  Entity & {
    readonly classname: "scripted_block";
    readonly controller: string;
  };
