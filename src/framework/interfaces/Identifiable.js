// @flow

export interface Identifiable {
  name(): Promise<string>;
}
