// @flow

import type { SceneState } from "../../../framework/interfaces/SceneState";

export default class Dialogue implements SceneState {
  _messages: Array<string>;

  constructor() {
    this._messages = [
      String(Math.random()),
      String(Math.random()),
      String(Math.random())
    ];
  }

  messages(): Array<string> {
    return this._messages;
  }
}
