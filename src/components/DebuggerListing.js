// @flow

import * as React from "react";
import Draggable from "react-draggable";
import ReactDOM from "react-dom";

import type { Debugger } from "../framework/interfaces/Debugger";

type Props = {|
  debug: Debugger
|};

export default React.memo<Props>(function DebuggerListing(props: Props) {
  const [debuggerState, setDebuggetState] = React.useState(
    props.debug.getState()
  );
  const [debuggerElement] = React.useState<?HTMLElement>(
    document.getElementById("debugger")
  );

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

  if (!debuggerElement || debuggerState.isEmpty()) {
    return null;
  }

  return ReactDOM.createPortal(
    <Draggable
      defaultClassNameDragging="dd__debugger__popup--dragging"
      defaultPosition={{
        x: 0,
        y: 0
      }}
      handle=".dd__debugger__popup__handle"
    >
      <div className="dd__debugger__popup dd__frame dd__frame--status">
        <div className="dd__debugger__popup__handle dd__frame">
          Debugger State Listing
        </div>
        <div className="dd__debugger__popup__content">
          <table>
            <tbody>
              {debuggerState.toArray().map(([breadcrumbs, value]) => (
                <tr key={breadcrumbs.asString()}>
                  <td>{breadcrumbs.asString()}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>,
    debuggerElement
  );
});
