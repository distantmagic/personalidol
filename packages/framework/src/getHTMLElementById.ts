import type { DOMWindow } from "./DOMWindow.type";

export function getHTMLElementById(window: DOMWindow, id: string): HTMLElement {
  const element = window.document.getElementById(id);

  if (!element) {
    throw new Error(`Element does not exist: "#${id}"`);
  }

  return element;
}
