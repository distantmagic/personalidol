// @flow strict

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import RuntimeCache from "./RuntimeCache";
import { default as CacheException } from "./Exception/Cache";

test("throws when requested key is not present in cache", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const runtimeCache = new RuntimeCache<string>(loggerBreadcrumbs);

  expect(function() {
    runtimeCache.get("nonexistent");
  }).toThrow(CacheException);
});

test("calls for value only once", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const runtimeCache = new RuntimeCache<string>(loggerBreadcrumbs);
  const storeCallback = jest.fn(function() {
    return "foo";
  });

  runtimeCache.remember("test", storeCallback);
  runtimeCache.remember("test", storeCallback);

  expect(storeCallback.mock.calls.length).toBe(1);
});

test("stores values on runtime", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const map = new Set<string>();
  const runtimeCache = new RuntimeCache<Set<string>>(loggerBreadcrumbs);

  const stored = runtimeCache.remember("foo", function() {
    return map;
  });

  expect(stored).toBe(map);
  expect(runtimeCache.has("foo")).toBe(true);
  expect(runtimeCache.get("foo")).toBe(map);
});
