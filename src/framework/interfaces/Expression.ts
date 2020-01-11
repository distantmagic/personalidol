// @flow strict

export interface Expression {
  execute(): Promise<string>;
}
