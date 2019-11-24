// @flow

import { DOMParser } from "xmldom";

import * as xml from "./xml";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";

test("finds element with attribute names", function() {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(
    `
      <test>
        <property type="foo" value="1" />
        <property type="bar" value="2" />
      </test>
    `,
    "application/xml"
  );
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const element1 = xml.getElementWithAttributes(loggerBreadcrumbs, doc, "property", {
    type: "foo",
    value: "1",
  });

  expect(element1).toBeDefined();

  const element2 = xml.getElementWithAttributes(loggerBreadcrumbs, doc, "property", {
    type: "bar",
    value: "1",
  });

  expect(element2).toBeUndefined();

  const element3 = xml.getElementWithAttributes(loggerBreadcrumbs, doc, "property", {
    type: "bar",
    value: "2",
  });

  expect(element3).toBeDefined();
});
