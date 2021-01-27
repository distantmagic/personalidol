import { Nameable } from "./Nameable.interface";

export interface StatsHooks extends Nameable {
  tick(delta: number): void;
}
