// @flow

import type { StateMachineFactoryClass } from "javascript-state-machine";

import type { FSMDefaultData } from "../types/FSMDefaultData";
import type { FSMDefaultConstructorArguments } from "../types/FSMDefaultConstructorArguments";

export interface FSMDefaultFactoryClass<States: string, Transitions>
  extends StateMachineFactoryClass<
    States,
    Transitions,
    FSMDefaultData<States, Transitions>,
    FSMDefaultConstructorArguments
  > {}
