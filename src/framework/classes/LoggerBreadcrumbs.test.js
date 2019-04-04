// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("has root breadcrumb", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  expect(breadcrumbs.asString()).toBe("root");
});

it("is immutable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  const breadcrumbsFoo = breadcrumbs.add("foo");

  expect(breadcrumbs.asString()).toBe("root");
  expect(breadcrumbsFoo.asString()).toBe("root/foo");

  const breadcrumbsFooBar = breadcrumbsFoo.add("bar");

  expect(breadcrumbs.asString()).toBe("root");
  expect(breadcrumbsFoo.asString()).toBe("root/foo");
  expect(breadcrumbsFooBar.asString()).toBe("root/foo/bar");
});
