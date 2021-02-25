import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

export interface AtlasService extends RegistersMessagePort, Service {}
