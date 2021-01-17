import type { EntityProperties } from "@personalidol/quakemaps/src/EntityProperties.type";

export type BaseEntity = {
  readonly classname: string;
  readonly properties: EntityProperties;
  readonly transferables: Array<Transferable>;
};
