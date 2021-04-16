import type { MessageSimulantRegister } from "./MessageSimulantRegister.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export interface SimulantFactory<S extends SimulantsLookup> {
  readonly isSimulantFactory: true;

  create<K extends string & keyof S>(request: MessageSimulantRegister<S, K>): S[K];
}
