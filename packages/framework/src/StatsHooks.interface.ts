import { Nameable } from "./Nameable.interface";

export interface StatsHooks extends Nameable {
  tickEnd(elapsedTime: number, currentTick: number): void;

  tickStart(delta: number, elapsedTime: number, currentTick: number): void;
}
