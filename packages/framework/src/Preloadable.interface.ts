import type { PreloadableCallback } from "./PreloadableCallback.type";

export interface Preloadable {
  readonly preload: PreloadableCallback;
}
