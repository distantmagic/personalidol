import * as React from "react";

import { Debugger } from "src/framework/interfaces/Debugger";
import { DebuggerState } from "src/framework/types/DebuggerState";

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
