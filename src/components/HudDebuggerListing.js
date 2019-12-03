// @flow

import * as React from "react";

import HudDebuggerStateListingItem from "./HudDebuggerStateListingItem";
import useDebuggerState from "../effects/useDebuggerState";

import type { Debugger } from "../framework/interfaces/Debugger";

type Props = {|
  debug: Debugger,
|};

export default React.memo<Props>(function HudDebuggerListing(props: Props) {
  const debuggerState = useDebuggerState(props.debug);

  if (!props.debug.isEnabled()) {
    return null;
  }

  return (
    <div className="dd__frame dd__debugger dd__debugger--hud">
      <div className="dd__debugger__handle">Debugger State Listing</div>
      <div className="dd__debugger__content">
        <table className="dd__table dd__table--debugger">
          <tbody>
            {debuggerState.toArray().map(([breadcrumbs, value]) => (
              <HudDebuggerStateListingItem breadcrumbs={breadcrumbs} key={breadcrumbs.asString()} value={value} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
