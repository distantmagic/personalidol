import type { Mountable } from "./Mountable.interface";

export interface View extends Mountable {
  readonly isScene: false;
  readonly isView: true;
  readonly needsUpdates: boolean;
}
