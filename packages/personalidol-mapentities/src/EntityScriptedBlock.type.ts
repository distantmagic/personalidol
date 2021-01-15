import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

export type EntityScriptedBlock = Geometry & {
  readonly classname: "scripted_block";
  readonly controller: string;
};
