import { hashAddSubRoute } from "./hashAddSubRoute";

test.each([
  ["#equipment", "options", "#equipment,options"],
  ["#options,equipment", "foo", "#equipment,foo,options"],
  ["#options", "equipment", "#equipment,options"],
])("route is added to the routes set", function (hash: string, remove: string, expected: string) {
  expect(hashAddSubRoute(hash, remove)).toBe(expected);
});

test("throws when route is already in the hash", function () {
  expect(function () {
    hashAddSubRoute("#options", "options");
  }).toThrow();
});
