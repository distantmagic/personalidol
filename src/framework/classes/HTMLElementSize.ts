import isEqualWithPrecision from "src/framework/helpers/isEqualWithPrecision";

import ElementSize from "src/framework/interfaces/ElementSize";
import { default as IHTMLElementSize } from "src/framework/interfaces/HTMLElementSize";

export default class HTMLElementSize implements IHTMLElementSize {
  readonly htmlElement: HTMLElement;
  readonly htmlElementHeight: number;
  readonly htmlElementScrollHeight: number;
  readonly htmlElementWidth: number;
  readonly unit: "px" = "px";

  constructor(htmlElement: HTMLElement) {
    this.htmlElement = htmlElement;
    this.htmlElementHeight = htmlElement.offsetHeight;
    this.htmlElementScrollHeight = htmlElement.scrollHeight;
    this.htmlElementWidth = htmlElement.offsetWidth;
  }

  getBaseArea(): number {
    return this.getHeight() * this.getWidth();
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
    return this.getHeight() === other.getHeight() && this.getWidth() === other.getWidth();
  }

  isEqualWithPrecision(other: ElementSize<"px">, precision: number): boolean {
    return isEqualWithPrecision(this.getHeight(), other.getHeight(), precision) && isEqualWithPrecision(this.getWidth(), other.getWidth(), precision);
  }
}
