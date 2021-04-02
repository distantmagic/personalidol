import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

import type { SimulantsLookup } from "./SimulantsLookup.type";

export type MessageSimulantRegister<L extends SimulantsLookup, K extends string & keyof L> = RPCMessage & {
  id: string;
  simulant: K;
};
