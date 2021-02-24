import type { Nameable } from "./Nameable.interface";
import type { PreloadableCallback } from "./PreloadableCallback.type";
import type { PreloadableState } from "./PreloadableState.type";

export interface Preloadable extends Nameable {
  readonly state: PreloadableState;
  readonly preload: PreloadableCallback;
}
