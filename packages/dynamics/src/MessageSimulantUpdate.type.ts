import type { SimulantsLookup } from "./SimulantsLookup.type";

export type MessageSimulantUpdate<L extends SimulantsLookup> = {
  id: string;
  simulant: string & keyof L;
};
