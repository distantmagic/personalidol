// @flow

export interface ExceptionHandlerFilter {
  isCapturable(Error): boolean;

  isRethrowable(error: Error): boolean;
}
