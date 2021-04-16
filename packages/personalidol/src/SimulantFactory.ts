import { WorldspawnGeometrySimulant } from "./WorldspawnGeometrySimulant";

import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { SimulantFactory as ISimulantFactory } from "@personalidol/dynamics/src/SimulantFactory.interface";

import type { SimulantsLookup } from "./SimulantsLookup.type";

export function SimulantFactory<S extends SimulantsLookup>(): ISimulantFactory<S> {
  function create<K extends string & keyof S>(message: MessageSimulantRegister<S, K>): S[K] {
    switch (message.simulant) {
      case "worldspawn-geoemetry":
        return WorldspawnGeometrySimulant(message.id, message.simulantFeedbackMessagePort) as S[K];
      default:
        throw new Error(`Unsupported simulant: "${message.simulant}"`);
    }
  }

  return Object.freeze({
    isSimulantFactory: true,

    create: create,
  });
}
