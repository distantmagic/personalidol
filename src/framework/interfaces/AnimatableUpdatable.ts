export interface AnimatableUpdatable {
  update(delta: number): void;

  useUpdate(): boolean;
}
