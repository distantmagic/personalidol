// @flow

import HTMLElementResizeEvent from "./HTMLElementResizeEvent";
import interval from "../../framework/helpers/interval";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { HTMLElementResizeEvent as HTMLElementResizeEventInterface } from "../interfaces/HTMLElementResizeEvent";

export default class HTMLElementResizeObserver {
  currentOffsetHeight: number;
  currentOffsetWidth: number;
  currentStyleHeight: string | void;
  currentStyleWidth: string | void;
  htmlElement: ?HTMLElement;

  constructor() {
    this.unobserve();
  }

  observe(htmlElement: HTMLElement) {
    this.unobserve();
    this.htmlElement = htmlElement;
  }

  unobserve() {
    this.currentOffsetHeight = -1;
    this.currentOffsetWidth = -1;
    this.htmlElement = null;
  }

  async *listen(
    cancelToken: CancelToken
  ): AsyncGenerator<HTMLElementResizeEventInterface, void, void> {
    for await (let tick of interval(40, cancelToken)) {
      const htmlElement = this.htmlElement;

      if (!htmlElement) {
        continue;
      }

      const offsetHeight = htmlElement.offsetHeight;
      const offsetWidth = htmlElement.offsetWidth;
      const styleHeight = htmlElement.style.height;
      const styleWidth = htmlElement.style.width;

      if (
        this.currentOffsetHeight !== offsetHeight ||
        this.currentOffsetWidth !== offsetWidth ||
        this.currentStyleHeight !== styleHeight ||
        this.currentStyleWidth !== styleWidth
      ) {
        yield new HTMLElementResizeEvent(tick, offsetWidth, offsetHeight);
      }

      this.currentOffsetHeight = offsetHeight;
      this.currentOffsetWidth = offsetWidth;
      this.currentStyleHeight = styleHeight;
      this.currentStyleWidth = styleWidth;
    }
  }
}
