import type { i18n } from "i18next";

import type { Preloadable } from "./Preloadable.interface";
import type { Service } from "./Service.interface";

export interface InternationalizationService extends Preloadable, Service {
  i18next: i18n;
}
