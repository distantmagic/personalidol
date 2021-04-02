import type { GenericCallback } from "./GenericCallback.type";

export type PreloadableCallback = GenericCallback | (() => Promise<void>);
