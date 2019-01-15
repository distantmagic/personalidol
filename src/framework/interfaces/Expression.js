// @flow

export interface Expression {
  execute(): Promise<string>;
}
