import type { Nameable } from "./Nameable.interface";
import type { PreloadableCallback } from "./PreloadableCallback.type";
import type { PreloadableState } from "./PreloadableState.type";

export interface Preloadable extends Nameable {
  readonly isPreloadable: true;
  readonly preload: PreloadableCallback;
  readonly state: PreloadableState;
}
