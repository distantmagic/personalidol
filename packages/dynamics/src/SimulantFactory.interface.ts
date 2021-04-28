/// <reference types="@types/ammo.js" />

import type { MessageSimulantRegister } from "./MessageSimulantRegister.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";
import type { UserDataRegistry } from "./UserDataRegistry.interface";

export interface SimulantFactory<S extends SimulantsLookup> {
  readonly isSimulantFactory: true;

  create<K extends string & keyof S>(
    ammo: typeof Ammo,
    dynamicsWorld: Ammo.btDiscreteDynamicsWorld,
    userDataRegistry: UserDataRegistry,
    request: MessageSimulantRegister<S, K>
  ): S[K];
}
