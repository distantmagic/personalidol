// @flow

import isJsonRpcMessageType from "./isJsonRpcMessageType";

test("determines if a string is JSON message type", function() {
  expect(isJsonRpcMessageType("promise")).toBe(true);
  expect(isJsonRpcMessageType("PrOmIsE")).toBe(false);
});
