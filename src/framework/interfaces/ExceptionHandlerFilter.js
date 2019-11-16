// @flow

export interface ExceptionHandlerFilter {
  isCapturable(Error): boolean;
}
