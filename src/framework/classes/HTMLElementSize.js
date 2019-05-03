// @flow

import type { ElementSize } from "../interfaces/ElementSize";
import type { ElementSizeSerializedObject } from "../types/ElementSizeSerializedObject";
import type { HTMLElementSize as HTMLElementSizeInterface } from "../interfaces/HTMLElementSize";

export default class HTMLElementSize implements HTMLElementSizeInterface {
  +htmlElement: HTMLElement;
  +htmlElementHeight: number;
  +htmlElementScrollHeight: number;
  +htmlElementWidth: number;

  constructor(htmlElement: HTMLElement) {
    this.htmlElement = htmlElement;
    this.htmlElementHeight = htmlElement.offsetHeight;
    this.htmlElementScrollHeight = htmlElement.scrollHeight;
    this.htmlElementWidth = htmlElement.offsetWidth;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): ElementSizeSerializedObject<"px"> {
    return {
      depth: this.getDepth(),
      height: this.getHeight(),
      width: this.getWidth()
    };
  }

  getAspect(): number {
    return this.getWidth() / this.getHeight();
  }

  getDepth(): 0 {
    return 0;
  }

  getHTMLElement(): HTMLElement {
    return this.htmlElement;
  }

  getHeight(): number {
    return this.htmlElementHeight;
  }

  getScrollHeight(): number {
    return this.htmlElementScrollHeight;
  }

  getWidth(): number {
    return this.htmlElementWidth;
  }

  isEqual(other: ElementSize<"px">): boolean {
    return (
      this.getHeight() === other.getHeight() &&
      this.getWidth() === other.getWidth()
    );
  }
}
