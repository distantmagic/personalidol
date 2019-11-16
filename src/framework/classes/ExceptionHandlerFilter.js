// @flow

import type { ExceptionHandlerFilter as ExceptionHandlerFilterInterface } from "../interfaces/ExceptionHandlerFilter";

export default class ExceptionHandlerFilter implements ExceptionHandlerFilterInterface {
  isCapturable(error: Error): boolean {
    return true;
  }
}
