import type { Geometry } from "./Geometry.type";

export type EntityWorldspawn = Geometry & {
  readonly classname: "worldspawn";
};
