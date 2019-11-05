// @flow

export interface Disposable {
  attach(): Promise<void>;

  dispose(): Promise<void>;
}
