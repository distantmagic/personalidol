/// <reference types="@types/ammo.js" />

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { DynamicsWorldInfo } from "./DynamicsWorldInfo.type";
import type { DynamicsWorldState } from "./DynamicsWorldState.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export interface DynamicsWorld<S extends SimulantsLookup> extends MainLoopUpdatable, Pauseable, Service {
  readonly info: DynamicsWorldInfo;
  readonly isDynamicsWorld: true;
  readonly state: DynamicsWorldState;
}
