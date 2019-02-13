// @flow

import ScrollbarPosition from "../classes/ScrollbarPosition";

it("orients scroll position", async () => {
  const scrollbar = new ScrollbarPosition(1000, 200, 10);
  const adjusted = scrollbar.adjust(100);

  expect(adjusted.scrollWidth).toBe(1000);
  expect(adjusted.offsetWidth).toBe(200);
  expect(adjusted.scrollLeft).toBe(110);
});
