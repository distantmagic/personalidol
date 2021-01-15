import type { Geometry } from "@personalidol/quakemaps/src/Geometry.type";

export type EntityWorldspawn = Geometry & {
  readonly classname: "worldspawn";
};
