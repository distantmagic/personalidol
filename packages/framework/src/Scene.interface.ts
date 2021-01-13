import type { Mountable } from "./Mountable.interface";

export interface Scene extends Mountable {
  readonly isScene: true;
  readonly isView: false;
}
