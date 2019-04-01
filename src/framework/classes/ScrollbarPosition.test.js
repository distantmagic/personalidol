// @flow

import ScrollbarPosition from "../classes/ScrollbarPosition";

it("orients scroll position", async () => {
  const scrollbar = new ScrollbarPosition(1000, 200, 75, 500);

  expect(scrollbar.isChanged()).toBe(false);

  const adjusted = scrollbar.adjust(200);

  expect(adjusted.scrollLength).toBe(1000);
  expect(adjusted.offsetLength).toBe(200);
  expect(adjusted.scrollOffset).toBe(700);
  // expect(adjusted.scrollPercentage).toBe(80);
  expect(adjusted.isChanged()).toBe(true);
});
