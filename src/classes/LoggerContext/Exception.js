// @flow

import LoggerContext from "../LoggerContext";

export default class Exception extends LoggerContext {
  error: Error;

  constructor(error: Error) {
    super();

    this.error = error;
  }
}
