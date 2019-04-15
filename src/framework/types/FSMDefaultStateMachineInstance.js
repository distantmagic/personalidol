// @flow

import type { StateMachineInstance } from "javascript-state-machine";

import type { FSMDefaultData } from "../types/FSMDefaultData";

export type FSMDefaultStateMachineInstance<
  States,
  Transitions
> = StateMachineInstance<
  States,
  Transitions,
  FSMDefaultData<States, Transitions>
>;
