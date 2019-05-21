// @flow

import type { TransitionEvent } from "javascript-state-machine";

export type FSMTransitionEventCallback<States, Transitions> = (TransitionEvent<States, Transitions>) => void;
