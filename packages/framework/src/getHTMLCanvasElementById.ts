import { getHTMLElementById } from "./getHTMLElementById";

import type { DOMWindow as JSDOMWindow } from "jsdom";

import type { DOMWindow } from "./DOMWindow.type";

export function getHTMLCanvasElementById(window: DOMWindow, id: string): HTMLCanvasElement {
  const element = getHTMLElementById(window, id);

  if (!(element instanceof (window as JSDOMWindow).HTMLCanvasElement)) {
    throw new Error(`Element was expected to be a canvas: "#${id}"`);
  }

  return element;
}
