// @flow

import * as React from "react";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { DebuggerStateValue } from "../framework/types/DebuggerStateValue";

type Props = {|
  debug: Debugger,
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
  const [debuggerState, setDebuggetState] = React.useState(props.debug.getState());

  React.useEffect(
    function() {
      const debug = props.debug;

      debug.onStateChange(setDebuggetState);

      return function() {
        debug.offStateChange(setDebuggetState);
      };
    },
    [props.debug]
  );

  return (
    <div className="dd__frame dd__debugger dd__debugger--hud">
      <div className="dd__debugger__handle">Debugger State Listing</div>
      <div className="dd__debugger__content">
        <table className="dd__table dd__table--debugger">
          <tbody>
            {debuggerState.toArray().map(([breadcrumbs, value]) => (
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
