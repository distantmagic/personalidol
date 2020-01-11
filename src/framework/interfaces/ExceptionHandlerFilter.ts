// @flow strict

export interface ExceptionHandlerFilter {
  isCapturable(Error): boolean;
}
