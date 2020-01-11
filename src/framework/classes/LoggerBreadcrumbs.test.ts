// @flow strict

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("has root breadcrumb", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  expect(breadcrumbs.asString()).toBe("root");
});

test("is immutable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  const breadcrumbsFoo = breadcrumbs.add("foo");

  expect(breadcrumbs.asString()).toBe("root");
  expect(breadcrumbsFoo.asString()).toBe("root/foo");

  const breadcrumbsFooBar = breadcrumbsFoo.add("bar");

  expect(breadcrumbs.asString()).toBe("root");
  expect(breadcrumbsFoo.asString()).toBe("root/foo");
  expect(breadcrumbsFooBar.asString()).toBe("root/foo/bar");
});

test("is memoized", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  const breadcrumbsFoo1 = breadcrumbs.add("foo");
  const breadcrumbsFoo2 = breadcrumbs.add("foo");

  // this one is important when passed as a React component prop
  // same object does not cause redraws
  expect(breadcrumbsFoo1).toBe(breadcrumbsFoo2);
});

test("is memoized and distinguishes branches", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  const breadcrumbsFoo1 = breadcrumbs.add("foo");
  const breadcrumbsFoo2 = breadcrumbs.add("bar");

  expect(breadcrumbsFoo2.asString()).toBe("root/bar");
  expect(breadcrumbsFoo1).not.toBe(breadcrumbsFoo2);
});

test("is stringable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  expect(
    breadcrumbs
      .add("foo")
      .add("bar baz")
      .asString()
  ).toEqual('root/foo/"bar baz"');
});
