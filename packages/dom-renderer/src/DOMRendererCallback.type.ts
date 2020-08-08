import type { ComponentChild } from "preact";

export type DOMRendererCallback = (data: any) => null | ComponentChild;
