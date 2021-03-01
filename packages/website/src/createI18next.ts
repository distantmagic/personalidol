import ChainedBackend from "i18next-chained-backend";
import HTTPBackend from "i18next-http-backend";
import i18next from "i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";
import LocalStorageBackend from "i18next-localstorage-backend";
import YAML from "js-yaml";

import type { i18n } from "i18next";

export function createI18next(): i18n {
  i18next
    .use(ChainedBackend)
    .use(intervalPlural)
    .init({
      debug: "info" === __LOG_LEVEL,
      fallbackLng: "en",
      lng: "en",
      ns: ["ui"],
      defaultNS: "__NOT_USED",
      supportedLngs: ["en", "pl"],

      backend: {
        backends: [LocalStorageBackend, HTTPBackend],
        backendOptions: [
          {
            defaultVersion: __BUILD_ID,
            store: window.sessionStorage,
          },
          {
            loadPath: `${__LOCALES_LOAD_PATH}?${__CACHE_BUST}`,
            parse: YAML.load,
          },
        ],
      },
    });

  return i18next;
}
