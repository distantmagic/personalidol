// @flow

export interface Observer {
  disconnect(): void;

  observe(): void;
}
