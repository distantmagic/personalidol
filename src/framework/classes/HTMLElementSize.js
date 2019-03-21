// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { HTMLElementSize as HTMLElementSizeInterface } from "../interfaces/HTMLElementSize";

export default class HTMLElementSize implements HTMLElementSizeInterface {
  +htmlElement: HTMLElement;
  +htmlElementHeight: number;
  +htmlElementWidth: number;

  constructor(htmlElement: HTMLElement) {
    this.htmlElement = htmlElement;
    this.htmlElementHeight = htmlElement.offsetHeight;
    this.htmlElementWidth = htmlElement.offsetWidth;
  }

  getAspect(): number {
    return this.getWidth() / this.getHeight();
  }

  getHTMLElement(): HTMLElement {
    return this.htmlElement;
  }

  getHeight(): number {
    return this.htmlElementHeight;
  }

  getWidth(): number {
    return this.htmlElementWidth;
  }

  isEqual(other: ElementSize): boolean {
    return (
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }
}