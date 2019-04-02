// @flow

import HTMLElementResizeEvent from "./HTMLElementResizeEvent";
import HTMLElementSize from "./HTMLElementSize";
import interval from "../helpers/interval";

import type { CancelToken } from "../interfaces/CancelToken";
import type { HTMLElementResizeEvent as HTMLElementResizeEventInterface } from "../interfaces/HTMLElementResizeEvent";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../interfaces/HTMLElementResizeObserver";
import type { HTMLElementSize as HTMLElementSizeInterface } from "../interfaces/HTMLElementSize";

export default class HTMLElementResizeObserver
  implements HTMLElementResizeObserverInterface {
  htmlElement: ?HTMLElement;
  htmlElementSize: ?HTMLElementSizeInterface;

  constructor() {
    this.htmlElement = null;
    this.htmlElementSize = null;
  }

  async *listen(
    cancelToken: CancelToken
  ): AsyncGenerator<HTMLElementResizeEventInterface, void, void> {
    for await (let tick of interval(40, cancelToken)) {
      const htmlElement = this.htmlElement;
      const previousHTMLElementSize = this.htmlElementSize;

      if (htmlElement) {
        const htmlElementSize = new HTMLElementSize(htmlElement);

        if (
          !previousHTMLElementSize ||
          !htmlElementSize.isEqual(previousHTMLElementSize)
        ) {
          yield new HTMLElementResizeEvent(tick, htmlElementSize);
        }

        this.htmlElementSize = new HTMLElementSize(htmlElement);
      }
    }
  }

  observe(htmlElement: HTMLElement): void {
    this.htmlElement = htmlElement;
    this.htmlElementSize = null;
  }

  unobserve(): void {
    this.htmlElement = null;
    this.htmlElementSize = null;
  }
}
