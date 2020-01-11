import * as React from "react";

import { Debugger } from "../framework/interfaces/Debugger";
import { DebuggerState } from "../framework/types/DebuggerState";

export default function useDebuggerState(debug: Debugger): DebuggerState {
  const [debuggerState, setDebuggetState] = React.useState(debug.getState());

  React.useEffect(
    function() {
      debug.onStateChange(setDebuggetState);

      return function() {
        debug.offStateChange(setDebuggetState);
      };
    },
    [debug]
  );

  return debuggerState;
}
