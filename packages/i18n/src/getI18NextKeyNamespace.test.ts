import { getI18NextKeyNamespace } from "./getI18NextKeyNamespace";

test("finds a translation key", function () {
  expect(getI18NextKeyNamespace("foo:bar")).toBe("foo");
  expect(getI18NextKeyNamespace("baz")).toBe("");
});
