import ChainedBackend from "i18next-chained-backend";
import HTTPBackend from "i18next-http-backend";
import i18next from "i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";

import { LoglevelPlugin } from "@personalidol/i18n/src/LoglevelPlugin";
import { monitorResponseProgress } from "@personalidol/framework/src/monitorResponseProgress";
import { Progress } from "@personalidol/framework/src/Progress";

import type { Logger } from "loglevel";
import type { i18n } from "i18next";

export function createI18next(logger: Logger, progressMessagePort: MessagePort): i18n {
  i18next
    .use(ChainedBackend)
    .use(intervalPlural)
    .use(LoglevelPlugin(logger))
    .init({
      debug: "debug" === __LOG_LEVEL,
      fallbackLng: "en",
      lng: "en",
      ns: ["ui"],
      defaultNS: "__NOT_USED",
      supportedLngs: ["en", "pl"],

      backend: {
        backends: [HTTPBackend],
        backendOptions: [
          {
            loadPath: `${__LOCALES_LOAD_PATH}?${__CACHE_BUST}`,
            parse: JSON.parse,
            request: function (options: any, url: string, payload: any, callback: Function) {
              const progress = Progress(progressMessagePort, "translation", url);

              progress
                .wait(
                  fetch(url)
                    .then(monitorResponseProgress(progress.progress, true))
                    .then(function (response: Response) {
                      if (!response.ok) {
                        return void callback(response.statusText || "Error", {
                          status: response.status,
                        });
                      }

                      return response.text();
                    })
                    .then(function (data: undefined | string) {
                      if (!data) {
                        return;
                      }

                      callback(null, {
                        status: 200,
                        data: data,
                      });
                    })
                )
                .catch(function (error) {
                  callback(error);
                });
            },
          },
        ],
      },
    });

  return i18next;
}
