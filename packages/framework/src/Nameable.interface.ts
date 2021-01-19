import type { Identifiable } from "./Identifiable.interface";

export interface Nameable extends Identifiable {
  name: string;
}
