// @flow

import StateMachine from "javascript-state-machine";

type States = "gas" | "liquid" | "solid";

type Transitions = {
  freeze: () => void,
  melt: () => void,
  vaporize: () => void,
  condense: () => void
};

type Methods = {|
  onMelt: () => string
|};

export default StateMachine.factory<States, Transitions, Methods>({
  init: "solid",
  transitions: [
    { name: "melt", from: "solid", to: "liquid" },
    { name: "freeze", from: "liquid", to: "solid" },
    { name: "vaporize", from: "liquid", to: "gas" },
    { name: "condense", from: "gas", to: "liquid" }
  ],
  methods: {
    onMelt(): string {
      return "I melted";
    }
    // onFreeze() {
    //   console.log('I froze')
    // },
    // onVaporize() {
    //   console.log('I vaporized')
    // },
    // onCondense() {
    //   console.log('I condensed')
    // }
  }
});
