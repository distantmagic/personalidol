import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";

export default interface Animatable extends AnimatableUpdatable {
  begin(): void;

  draw(interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): boolean;

  useDraw(): boolean;

  useEnd(): boolean;
}
