// @flow

import EventEmitter from "eventemitter3";
import StateMachine from "javascript-state-machine";

import InvalidTransitionException from "../classes/Exception/StateMachine/InvalidTransition";

import type {
  StateMachineConstructor,
  TransitionsConfiguration,
  TransitionEvent
} from "javascript-state-machine";

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

type Methods = {||};

type TransitionEventCallback<States, Transitions> = (
  TransitionEvent<States, Transitions>
) => void;

type TransitionEventSubscriber<States, Transitions> = (
  States & string,
  TransitionEventCallback<States, Transitions>
) => void;

type Data<States, Transitions> = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  off: TransitionEventSubscriber<States, Transitions>,
  on: TransitionEventSubscriber<States, Transitions>
|};

type ConstructorArguments = [ExceptionHandler, LoggerBreadcrumbs];

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
    data: function(
      exceptionHandler: ExceptionHandler,
      loggerBreadcrumbs: LoggerBreadcrumbs
    ) {
      return {
        exceptionHandler: exceptionHandler,
        loggerBreadcrumbs: loggerBreadcrumbs,

        off: function(
          state: States & string,
          callback: TransitionEventCallback<States, Transitions>
        ) {
          events.off(state, callback);
        },
        on: function(
          state: States & string,
          callback: TransitionEventCallback<States, Transitions>
        ) {
          events.on(state, callback);
        }
      };
    },
    transitions: config.transitions,
    methods: {
      onAfterTransition: function(
        evt: TransitionEvent<States, Transitions>
      ): void {
        events.emit(evt.to, evt);
      },
      onInvalidTransition: function(
        transition: $Keys<Transitions>,
        from: States & string,
        to: States & string
      ): void {
        const exceptionHandler: ExceptionHandler = this.exceptionHandler;
        const loggerBreadcrumbs: LoggerBreadcrumbs = this.loggerBreadcrumbs;
        const error = new InvalidTransitionException(transition, from, to);

        exceptionHandler.captureException(loggerBreadcrumbs, error);

        throw error;
      }
    }
  });
}
