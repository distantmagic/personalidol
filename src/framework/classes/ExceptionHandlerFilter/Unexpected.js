// @flow

import ExceptionHandlerFilter from "../ExceptionHandlerFilter";
import { default as CanceledException } from "../Exception/CancelToken/Canceled";

export default class Unexpected extends ExceptionHandlerFilter {
  isCapturable(error: Error): boolean {
    return super.isCapturable(error) && !(error instanceof CanceledException);
  }
}
