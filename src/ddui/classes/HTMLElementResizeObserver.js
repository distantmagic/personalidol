// @flow

import HTMLElementResizeEvent from "./HTMLElementResizeEvent";
import interval from "../../framework/helpers/interval";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { HTMLElementResizeEvent as HTMLElementResizeEventInterface } from "../interfaces/HTMLElementResizeEvent";

export default class HTMLElementResizeObserver {
  currentHeight: number;
  currentWidth: number;
  htmlElement: ?HTMLElement;

  constructor() {
    this.unobserve();
  }

  observe(htmlElement: HTMLElement) {
    this.unobserve();
    this.htmlElement = htmlElement;
  }

  unobserve() {
    this.currentHeight = -1;
    this.currentWidth = -1;
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

      if (
        this.currentHeight !== offsetHeight ||
        this.currentWidth !== offsetWidth
      ) {
        yield new HTMLElementResizeEvent(tick, offsetWidth, offsetHeight);
      }

      this.currentHeight = offsetHeight;
      this.currentWidth = offsetWidth;
    }
  }
}
