// @flow

export interface Drawable {
  draw(interpolationPercentage: number): void;

  useDraw(): boolean;
}
