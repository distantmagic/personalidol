// @flow

import * as React from "react";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { DebuggerState } from "../framework/types/DebuggerState";

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
