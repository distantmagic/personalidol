import type { Nameable } from "./Nameable.interface";

export interface Service extends Nameable {
  start(): void;

  stop(): void;
}
