import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("has / breadcrumb", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  expect(breadcrumbs.asString()).toBe("/");
});

test("is immutable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  const breadcrumbsFoo = breadcrumbs.add("foo");

  expect(breadcrumbs.asString()).toBe("/");
  expect(breadcrumbsFoo.asString()).toBe("/foo");

  const breadcrumbsFooBar = breadcrumbsFoo.add("bar");

  expect(breadcrumbs.asString()).toBe("/");
  expect(breadcrumbsFoo.asString()).toBe("/foo");
  expect(breadcrumbsFooBar.asString()).toBe("/foo/bar");
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

  expect(breadcrumbsFoo2.asString()).toBe("/bar");
  expect(breadcrumbsFoo1).not.toBe(breadcrumbsFoo2);
});

test("is stringable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();

  expect(
    breadcrumbs
      .add("foo")
      .add("bar baz")
      .asString()
  ).toEqual('/foo/"bar baz"');
});
