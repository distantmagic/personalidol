import type { Mount } from "./Mount.interface";

export interface View extends Mount {
  readonly isScene: false;
  readonly isView: true;
  readonly needsUpdates: boolean;
}
