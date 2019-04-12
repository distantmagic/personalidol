// @flow

import fsm from "../framework/helpers/fsm";

type States =
  | "attached"
  | "attaching"
  | "loaded"
  | "loading"
  | "looping"
  | "none"
  | "starting"
  | "started"
  | "stopping"
  | "stopped";

type Transitions = {
  attach: () => void,
  attached: () => void,
  load: () => void,
  loaded: () => void,
  loop: () => void,
  start: () => void,
  started: () => void
};

export default fsm<States, Transitions>({
  init: "none",
  transitions: [
    { name: "attach", from: "none", to: "attaching" },
    { name: "attached", from: "attaching", to: "attached" },
    { name: "load", from: "attached", to: "loading" },
    { name: "loaded", from: "loading", to: "loaded" },
    { name: "start", from: "loaded", to: "starting" },
    { name: "started", from: "starting", to: "started" },
    { name: "loop", from: "started", to: "looping" }
  ]
});
