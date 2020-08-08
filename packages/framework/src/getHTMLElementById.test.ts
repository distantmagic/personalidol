import { JSDOM } from "jsdom";

import { getHTMLElementById } from "./getHTMLElementById";

test("finds dom element", function () {
  const dom = new JSDOM(`<!DOCTYPE html><div id="test">Hello</div>`);
  const element = getHTMLElementById(dom.window, "test");

  expect(element.textContent).toBe("Hello");
});

test("throws when document is not found", function () {
  const dom = new JSDOM(`<!DOCTYPE html><div id="test">Hello</div>`);

  expect(function () {
    getHTMLElementById(dom.window, "foo");
  }).toThrow();
});
