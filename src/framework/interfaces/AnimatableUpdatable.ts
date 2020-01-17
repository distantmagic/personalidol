export default interface AnimatableUpdatable {
  update(delta: number): void;

  useUpdate(): boolean;
}
