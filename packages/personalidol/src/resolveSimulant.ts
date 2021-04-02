import { WorldspawnGeometrySimulant } from "./WorldspawnGeometrySimulant";

import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";

import type { SimulantsLookup } from "./SimulantsLookup.type";

export function resolveSimulant<L extends SimulantsLookup, K extends string & keyof L = string & keyof L>(message: MessageSimulantRegister<L, K>): L[K] {
  switch (message.simulant) {
    case "worldspawn-geoemetry":
      return WorldspawnGeometrySimulant(message.id, message.simulantFeedbackMessagePort) as L[K];
    default:
      throw new Error(`Unsupported simulant: "${message.simulant}"`);
  }
}
