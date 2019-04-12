// @flow

import StateMachine from "javascript-state-machine";

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

type Methods = {|
  onAttached: () => void
|};

type Data = {|
  foo: string,
  bar: string
|};

type ConstructorArguments = [string, string];

export default StateMachine.factory<
  States,
  Transitions,
  Methods,
  Data,
  ConstructorArguments
>({
  init: "none",
  data: function(foo: string, bar: string) {
    return {
      foo: foo,
      bar: bar
    };
  },
  transitions: [
    { name: "attach", from: "none", to: "attaching" },
    { name: "attached", from: "attaching", to: "attached" },
    { name: "load", from: "attached", to: "loading" },
    { name: "loaded", from: "loading", to: "loaded" },
    { name: "start", from: "loaded", to: "starting" },
    { name: "started", from: "starting", to: "started" },
    { name: "loop", from: "started", to: "looping" }
  ],
  methods: {
    onAttached(): void {
      console.log("I melted");
    }
  }
});
