import type { Mount } from "./Mount.interface";

export interface Scene extends Mount {
  readonly isScene: true;
  readonly isView: false;
}
