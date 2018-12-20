// @flow

import type { SceneState } from "../../interfaces/SceneState";

export default class Dialogue implements SceneState {
  _messages: Array<string>;
  _prompt: string;

  constructor() {
    this._prompt = String(Math.random());
    this._messages = [
      String(Math.random()),
      String(Math.random()),
      String(Math.random())
    ];
  }

  buttons(): Array<string> {
    return this._messages;
  }

  prompt(): string {
    return this._prompt;
  }
}
