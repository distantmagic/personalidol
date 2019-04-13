// @flow

import StateMachine from "../StateMachine";

export default class InvalidTransition extends StateMachine {
  constructor(transition: string, from: string, to: string) {
    super(`Invalid transition "${transition}" from "${from}" to "${to}".`);
  }
}
