import { Nameable } from "./Nameable.interface";

export interface MainLoopStatsHook extends Nameable {
  tick(timestamp: number): void;
}
