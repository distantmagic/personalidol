import type { SimulantsLookup } from "./SimulantsLookup.type";

export type MessageFeedbackSimulantPreloaded<L extends SimulantsLookup, K extends string & keyof L> = {
  id: string;
  simulant: K;
};
