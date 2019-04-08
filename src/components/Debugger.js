// @flow

import * as React from "react";
import Draggable from "react-draggable";
import ReactDOM from "react-dom";

type Props = {|
  debuggerState: {
    [string]: number | string
  }
|};

export default React.memo<Props>(function Debugger(props: Props) {
  const [debuggerElement] = React.useState<?HTMLElement>(
    document.getElementById("debugger")
  );

  if (!debuggerElement) {
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
        <div className="dd__debugger__popup__handle dd__frame">Debugger</div>
        <div className="dd__debugger__popup__content">
          <table>
            <tbody>
              {Object.keys(props.debuggerState).map(key => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{props.debuggerState[key]}</td>
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
