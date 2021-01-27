import { Nameable } from "./Nameable.interface";

export interface MainLoopStatsHook extends Nameable {
  tick(delta: number): void;
}
