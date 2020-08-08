export interface MainLoopUpdatable {
  update(delta: number, elapsedTime: number): void;
}
