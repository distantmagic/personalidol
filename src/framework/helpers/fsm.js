// @flow

import EventEmitter from "eventemitter3";
import StateMachine from "javascript-state-machine";

import InvalidTransitionException from "../classes/Exception/StateMachine/InvalidTransition";

import type {
  TransitionsConfiguration,
  TransitionEvent
} from "javascript-state-machine";

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { FSMDefaultData } from "../types/FSMDefaultData";
import type { FSMDefaultConstructorArguments } from "../types/FSMDefaultConstructorArguments";
import type { FSMDefaultFactoryClass } from "../interfaces/FSMDefaultFactoryClass";
import type { FSMDefaultMethods } from "../types/FSMDefaultMethods";
import type { FSMTransitionEventCallback } from "../types/FSMTransitionEventCallback";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default function fsm<States, Transitions: {}>(config: {|
  init: States & string,
  transitions: TransitionsConfiguration<States, Transitions>
|}): Class<FSMDefaultFactoryClass<States, Transitions>> {
  const events = new EventEmitter();

  return StateMachine.factory<
    States,
    Transitions,
    FSMDefaultMethods,
    FSMDefaultData<States, Transitions>,
    FSMDefaultConstructorArguments
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
          callback: FSMTransitionEventCallback<States, Transitions>
        ) {
          events.off(state, callback);
        },
        on: function(
          state: States & string,
          callback: FSMTransitionEventCallback<States, Transitions>
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
