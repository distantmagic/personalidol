// @flow

export interface Animatable {
  begin(): void;

  update(delta: number): void;
}
