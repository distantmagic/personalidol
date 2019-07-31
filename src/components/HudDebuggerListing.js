// @flow

import * as React from "react";

import type { DebuggerState } from "../framework/types/DebuggerState";

type Props = {|
  debuggerState: DebuggerState,
|};

export default React.memo<Props>(function HudDebuggerListing(props: Props) {
  return (
    <div className="dd__frame dd__debugger dd__debugger--hud">
      <div className="dd__debugger__handle">Debugger State Listing</div>
      <div className="dd__debugger__content">
        <table className="dd__table">
          <tbody>
            {props.debuggerState.toArray().map(([breadcrumbs, value]) => (
              <tr key={breadcrumbs.asString()}>
                <td className="dd__debugger__breadcrumbs">
                  {breadcrumbs.asString()}
                </td>
                <td className="dd__debugger__value">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
