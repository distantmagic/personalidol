import type { ComponentChild } from "preact";

export type DOMRendererCallback = (uiMessagePort: MessagePort, data: any) => null | ComponentChild | Array<ComponentChild>;
