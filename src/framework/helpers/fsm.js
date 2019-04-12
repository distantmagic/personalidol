// @flow

import EventEmitter from "eventemitter3";
import StateMachine from "javascript-state-machine";

import type {
  StateMachineConstructor,
  TransitionsConfiguration,
  TransitionEvent
} from "javascript-state-machine";

type Methods = {||};

type Data = {|
  events: EventEmitter,
|};

type ConstructorArguments = [];

export default function fsm<States, Transitions: {}>(config: {|
  init: States,
  transitions: TransitionsConfiguration<States, Transitions>
|}): Class<StateMachineConstructor<States, Transitions, Data,  ConstructorArguments>> {
  return StateMachine.factory<
    States,
    Transitions,
    Methods,
    Data,
    ConstructorArguments
  >({
    init: config.init,
    data: function() {
      return {
        events: new EventEmitter(),
      };
    },
    transitions: config.transitions,
    methods: {
      onAfterTransition(evt: TransitionEvent<States, Transitions>): void {
        this.events.emit(evt.to, evt);
      },
      onInvalidTransition(transition: $Keys<Transitions>, from: States, to: States): void {
        console.log(transition, from, to);
      }
    }
  });
}
