// @flow

export default function isJsonRpcMessageType(type: string): %checks {
  return type === "error" || type === "generator" || type === "promise";
}
