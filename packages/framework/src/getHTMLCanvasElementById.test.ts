import { JSDOM } from "jsdom";

import { getHTMLCanvasElementById } from "./getHTMLCanvasElementById";

test("finds dom element", function () {
  const dom = new JSDOM(`<!DOCTYPE html><canvas id="test">Hello</canvas>`);
  const element = getHTMLCanvasElementById(dom.window, "test");

  expect(element.textContent).toBe("Hello");
});

test("throws when document is not a canvas", function () {
  const dom = new JSDOM(`<!DOCTYPE html><div id="test">Hello</div>`);

  expect(function () {
    getHTMLCanvasElementById(dom.window, "test");
  }).toThrow();
});

test("throws when document is not found", function () {
  const dom = new JSDOM(`<!DOCTYPE html><canvas id="test">Hello</canvas>`);

  expect(function () {
    getHTMLCanvasElementById(dom.window, "foo");
  }).toThrow();
});
