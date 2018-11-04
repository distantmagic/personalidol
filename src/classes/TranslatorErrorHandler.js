// @flow

import { default as ExceptionLoggerContext } from './LoggerContext/Exception';
import { default as MissingKeyException } from './Exception/Translator/MissingKey';
import { default as MissingInterpolationException } from './Exception/Translator/MissingInterpolation';
import { default as ReturnedObjectException } from './Exception/Translator/ReturnedObject';

import type { Logger } from '../interfaces/Logger';

export default class TranslatorErrorHandler {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  missingInterpolationHandler(text: string, value: string): ?string {
    const exception = new MissingInterpolationException(text, value);

    this.logger.error(new ExceptionLoggerContext(exception));
  }

  missingKeyHandler(lng: string, ns: string, key: string, fallbackValue: string): void {
    const exception = new MissingKeyException(lng, ns, key, fallbackValue);

    this.logger.error(new ExceptionLoggerContext(exception));
  }

  returnedObjectHandler(key: string, value: string, options: any): ?string {
    const exception = new ReturnedObjectException(key, value, options);

    this.logger.error(new ExceptionLoggerContext(exception));
  }
}
