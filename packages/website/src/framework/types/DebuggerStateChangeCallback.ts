import type DebuggerState from "src/framework/types/DebuggerState";

type DebuggerStateChangeCallback = (state: DebuggerState) => void;

export default DebuggerStateChangeCallback;
