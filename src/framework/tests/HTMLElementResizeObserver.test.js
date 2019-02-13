// @flow

import CancelToken from "../../framework/classes/CancelToken";
import HTMLElementResizeObserver from "../classes/HTMLElementResizeObserver";

it("observes element changes", async () => {
  const cancelToken = new CancelToken();
  const events = [];
  const htmlElement = document.createElement("div");
  const observer = new HTMLElementResizeObserver();

  observer.observe(htmlElement);
});
