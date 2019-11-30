// @flow

import { EventDispatcher } from "three";
import StateMachine from "javascript-state-machine";

import InvalidTransitionException from "../classes/Exception/StateMachine/InvalidTransition";

import type { TransitionsConfiguration, TransitionEvent } from "javascript-state-machine";

import type { FSMDefaultData } from "../types/FSMDefaultData";
import type { FSMDefaultConstructorArguments } from "../types/FSMDefaultConstructorArguments";
import type { FSMDefaultFactoryClass } from "../interfaces/FSMDefaultFactoryClass";
import type { FSMDefaultMethods } from "../types/FSMDefaultMethods";
import type { FSMTransitionEventCallback } from "../types/FSMTransitionEventCallback";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default function fsm<States: string, Transitions: {}>(config: {|
  init: States,
  transitions: TransitionsConfiguration<States, Transitions>,
|}): Class<FSMDefaultFactoryClass<States, Transitions>> {
  const events = new EventDispatcher<States | "any">();

  return StateMachine.factory<States, Transitions, FSMDefaultMethods, FSMDefaultData<States, Transitions>, FSMDefaultConstructorArguments>({
    init: config.init,
    data: function(loggerBreadcrumbs: LoggerBreadcrumbs) {
      return {
        loggerBreadcrumbs: loggerBreadcrumbs,

        addEventListener: function(state: States, callback: FSMTransitionEventCallback<States, Transitions>) {
          events.addEventListener(state, callback);
        },
        addEventListenerAny: function(callback: FSMTransitionEventCallback<States, Transitions>) {
          events.addEventListener("any", callback);
        },
        removeEventListener: function(state: States, callback: FSMTransitionEventCallback<States, Transitions>) {
          events.removeEventListener(state, callback);
        },
        removeEventListenerAny: function(callback: FSMTransitionEventCallback<States, Transitions>) {
          events.removeEventListener("any", callback);
        },
      };
    },
    transitions: config.transitions,
    methods: {
      onAfterTransition: function(evt: TransitionEvent<States, Transitions>): void {
        if (evt.to === evt.from) {
          return;
        }
        events.dispatchEvent<TransitionEvent<States, Transitions>>({
          from: evt.from,
          to: evt.to,
          transition: evt.transition,
          type: "any",
        });
        events.dispatchEvent<TransitionEvent<States, Transitions>>({
          from: evt.from,
          to: evt.to,
          transition: evt.transition,
          type: evt.to,
        });
      },
      onInvalidTransition: function(transition: $Keys<Transitions>, from: States, to: States): void {
        const loggerBreadcrumbs: LoggerBreadcrumbs = this.loggerBreadcrumbs;
        const error = new InvalidTransitionException(loggerBreadcrumbs, transition, from, to);

        throw error;
      },
    },
  });
}
