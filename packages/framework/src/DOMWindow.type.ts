import type { DOMWindow as JSDOMWindow } from "jsdom";

export type DOMWindow = JSDOMWindow | Window;
