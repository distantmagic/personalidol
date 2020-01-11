// @flow strict

export interface Identifiable {
  name(): Promise<string>;
}
