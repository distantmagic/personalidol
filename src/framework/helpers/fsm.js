// @flow

import EventEmitter from "eventemitter3";
import StateMachine from "javascript-state-machine";

import type {
  StateMachineConstructor,
  TransitionsConfiguration,
  TransitionEvent
} from "javascript-state-machine";

type Methods = {||};

type TransitionEventCallback<States, Transitions> = (
  TransitionEvent<States, Transitions>
) => void;

type TransitionEventSubscriber<States, Transitions> = (
  States & string,
  TransitionEventCallback<States, Transitions>
) => void;

type Data<States, Transitions> = {|
  off: TransitionEventSubscriber<States, Transitions>,
  on: TransitionEventSubscriber<States, Transitions>
|};

type ConstructorArguments = [];

export default function fsm<States, Transitions: {}>(config: {|
  init: States & string,
  transitions: TransitionsConfiguration<States, Transitions>
|}): Class<
  StateMachineConstructor<
    States,
    Transitions,
    Data<States, Transitions>,
    ConstructorArguments
  >
> {
  const events = new EventEmitter();

  return StateMachine.factory<
    States,
    Transitions,
    Methods,
    Data<States, Transitions>,
    ConstructorArguments
  >({
    init: config.init,
    data: function() {
      return {
        off(
          state: States & string,
          callback: TransitionEventCallback<States, Transitions>
        ) {
          events.off(state, callback);
        },
        on(
          state: States & string,
          callback: TransitionEventCallback<States, Transitions>
        ) {
          events.on(state, callback);
        }
      };
    },
    transitions: config.transitions,
    methods: {
      onAfterTransition(evt: TransitionEvent<States, Transitions>): void {
        events.emit(evt.to, evt);
      },
      onInvalidTransition(
        transition: $Keys<Transitions>,
        from: States,
        to: States
      ): void {
        console.log(transition, from, to);
      }
    }
  });
}
