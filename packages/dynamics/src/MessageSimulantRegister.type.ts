import type { SimulantsLookup } from "./SimulantsLookup.type";

export type MessageSimulantRegister<L extends SimulantsLookup, K extends string & keyof L> = {
  id: string;
  simulant: K;
  simulantFeedbackMessagePort: MessagePort;
};
