// @flow

import i18next from "i18next";

import Translator from "./Translator";
import TranslatorErrorHandler from "./TranslatorErrorHandler";

import type { Logger } from "../interfaces/Logger";

export default class TranslatorBuilder {
  +logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  createTranslator(resources: {}): Promise<Translator> {
    return new Promise((resolve, reject) => {
      const i18nextInstance = i18next.createInstance();
      const errorHandler = new TranslatorErrorHandler(this.logger);

      i18nextInstance.init(
        {
          // debug: process.env.REACT_APP_DEBUG,
          debug: false,
          defaultNS: "default",
          fallbackLng: "dev",
          missingInterpolationHandler: errorHandler.missingInterpolationHandler,
          missingKeyHandler: errorHandler.missingKeyHandler,
          ns: ["default"],
          resources: resources,
          returnedObjectHandler: errorHandler.returnedObjectHandler,
          returnEmptyString: false,
          returnNull: false,
          saveMissing: true
        },
        err => {
          if (err) {
            this.logger.error(err.message);
            reject(err);
          } else {
            resolve(new Translator(i18nextInstance, errorHandler));
          }
        }
      );
    });
  }
}
