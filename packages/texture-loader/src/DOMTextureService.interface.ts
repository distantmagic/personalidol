import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { RegistersMessagePort } from "./RegistersMessagePort.interface";

export interface DOMTextureService extends MainLoopUpdatable, RegistersMessagePort, Service {}
