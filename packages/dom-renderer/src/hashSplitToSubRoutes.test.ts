import { hashSplitToSubRoutes } from "./hashSplitToSubRoutes";

test.each([
  ["", []],
  ["#", []],
  ["#options", ["options"]],
  ["#options,equipment", ["options", "equipment"]],
])("hash is splitted into subroutes: '%s' -> '%s'", function (hash: string, routes: ReadonlyArray<string>) {
  expect(hashSplitToSubRoutes(hash)).toEqual(routes);
});
