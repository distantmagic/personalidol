import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityScriptedBlock = Geometry &
  BaseEntity & {
    readonly classname: "scripted_block";
    readonly controller: string;
  };
