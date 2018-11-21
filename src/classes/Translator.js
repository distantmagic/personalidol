// @flow

import TranslatorErrorHandler from "./TranslatorErrorHandler";

type I18nextTranslateKeys = Array<string> | string;
type I18nextType = {
  exists: I18nextTranslateKeys => boolean,
  t: I18nextTranslateKeys => string
};

export default class Translator {
  errorHandler: TranslatorErrorHandler;
  i18next: I18nextType;

  constructor(i18next: I18nextType, errorHandler: TranslatorErrorHandler) {
    this.i18next = i18next;
  }

  exists(keys: I18nextTranslateKeys): boolean {
    return this.i18next.exists(keys);
  }

  translate(keys: I18nextTranslateKeys): string {
    return this.i18next.t(keys);
  }
}
