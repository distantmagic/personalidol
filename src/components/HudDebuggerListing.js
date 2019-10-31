// @flow

import * as React from "react";

import type { DebuggerState } from "../framework/types/DebuggerState";
import type { DebuggerStateValue } from "../framework/types/DebuggerStateValue";

type Props = {|
  debuggerState: DebuggerState,
|};

function printValue(value: DebuggerStateValue): string {
  if (Array.isArray(value)) {
    return `[${value.map(printValue).join(",")}]`;
  }

  if ("number" === typeof value) {
    return String(value);
  }

  if ("string" === typeof value) {
    return value;
  }

  return `vec3(${printValue(value.toArray())})`;
}

export default function HudDebuggerListing(props: Props) {
  return (
    <div className="dd__frame dd__debugger dd__debugger--hud">
      <div className="dd__debugger__handle">Debugger State Listing</div>
      <div className="dd__debugger__content">
        <table className="dd__table dd__table--debugger">
          <tbody>
            {props.debuggerState.toArray().map(([breadcrumbs, value]) => (
              <tr key={breadcrumbs.asString()}>
                <td className="dd__debugger__breadcrumbs">{breadcrumbs.asString()}</td>
                <td className="dd__debugger__value">{printValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
