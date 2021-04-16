/// <reference types="@types/ammo.js" />

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { DynamicsWorldInfo } from "./DynamicsWorldInfo.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export interface DynamicsWorld<S extends SimulantsLookup> extends MainLoopUpdatable, Service {
  readonly info: DynamicsWorldInfo;
  readonly isDynamicsWorld: true;
}
