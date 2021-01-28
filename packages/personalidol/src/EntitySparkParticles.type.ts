import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntitySparkParticles = BaseEntity & {
  readonly classname: "spark_particles";
  readonly origin: Vector3Simple;
};
