// @flow

import * as React from "react";
import * as THREE from "three";

import type { DebuggerStateValue } from "../framework/types/DebuggerStateValue";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";

function printValue(value: DebuggerStateValue): string {
  if (Array.isArray(value)) {
    return `[${value.map(printValue).join(",")}]`;
  }

  if ("function" === typeof value.toString) {
    const stringValue = value.toString();

    // false hopes here
    if ("string" === typeof stringValue && "[object Object]" !== stringValue) {
      return stringValue;
    }
  }

  if ("number" === typeof value) {
    return String(value);
  }

  if ("string" === typeof value) {
    return value;
  }

  if (value instanceof THREE.Vector2) {
    return `vec2(${printValue(value.toArray())})`;
  }

  return `vec3(${printValue(value.toArray())})`;
}

type Props = {|
  breadcrumbs: LoggerBreadcrumbs,
  value: DebuggerStateValue,
|};

export default function HudDebuggerStateListingItem(props: Props) {
  return (
    <tr>
      <td className="dd__debugger__breadcrumbs">{props.breadcrumbs.asString()}</td>
      <td className="dd__debugger__value">{printValue(props.value)}</td>
    </tr>
  );
}
