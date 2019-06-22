// @flow

export type GameTransitions = {|
  idle: () => void,
  run: () => void,
  walk: () => void,
|};
