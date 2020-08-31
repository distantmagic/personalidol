import { hashRemoveSubRoute } from "./hashRemoveSubRoute";

test.each([
  ["#options,equipment", "options", "#equipment"],
  ["#options,equipment", "equipment", "#options"],
  ["#options,equipment,foo", "foo", "#equipment,options"],
  ["#options", "options", "#"],
])("route is removed from routes set", function (hash: string, remove: string, expected: string) {
  expect(hashRemoveSubRoute(hash, remove)).toBe(expected);
});

test("throws when route is not in the hash", function () {
  expect(function () {
    hashRemoveSubRoute("#options", "equipment");
  }).toThrow();
});
