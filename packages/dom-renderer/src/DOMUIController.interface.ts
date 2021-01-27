import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

export interface DOMUIController extends MainLoopUpdatable, RegistersMessagePort, Service {}
