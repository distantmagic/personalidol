// @flow

import CancelToken from "../../framework/classes/CancelToken";
import HTMLElementResizeObserver from "../classes/HTMLElementResizeObserver";

it("observes element changes", async () => {
  const cancelToken = new CancelToken();
  const events = [];
  const htmlElement = document.createElement("div");
  const observer = new HTMLElementResizeObserver();

  observer.observe(htmlElement);

  for await (let evt of observer.listen(cancelToken)) {
    events.push(evt);

    htmlElement.style.height = "100px";
    htmlElement.style.width = "200px";

    if (events.length > 1) {
      break;
    }
  }

  expect(events).toHaveLength(2);
});
