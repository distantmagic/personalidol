import Backend from "i18next-http-backend";
import i18next from "i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";
import YAML from "js-yaml";

import type { i18n } from "i18next";

export async function init_i18next(): Promise<i18n> {
  await i18next
    .use(Backend)
    .use(intervalPlural)
    .init({
      debug: "info" === __LOG_LEVEL,
      fallbackLng: "en",
      lng: "en",
      ns: ["ui"],
      defaultNS: "__NOT_USED",
      supportedLngs: ["en", "pl"],

      backend: {
        loadPath: `${__LOCALES_LOAD_PATH}?${__CACHE_BUST}`,
        parse: function (data: string) {
          return YAML.load(data);
        },
      },
    });

  return i18next;
}
