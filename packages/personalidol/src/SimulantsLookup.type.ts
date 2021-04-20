import type { Simulant } from "@personalidol/dynamics/src/Simulant.interface";
import type { SimulantsLookup as BaseSimulantsLookup } from "@personalidol/dynamics/src/SimulantsLookup.type";

export type SimulantsLookup = BaseSimulantsLookup & {
  npc: Simulant;
  "worldspawn-geoemetry": Simulant;
};
