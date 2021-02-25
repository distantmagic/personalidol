import type { i18n } from "i18next";

import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

export interface InternationalizationService extends Preloadable, RegistersMessagePort, Service {
  i18next: i18n;
}
