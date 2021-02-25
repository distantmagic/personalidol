import type { i18n } from "i18next";

import type { Preloadable } from "./Preloadable.interface";
import type { RegistersMessagePort } from "./RegistersMessagePort.interface";
import type { Service } from "./Service.interface";

export interface InternationalizationService extends Preloadable, RegistersMessagePort, Service {
  i18next: i18n;
}
