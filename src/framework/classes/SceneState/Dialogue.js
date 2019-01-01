// @flow

import DialogueButton from "../DialogueButton";
import Collection from "../Collection";

import type { SceneState } from "../../interfaces/SceneState";

export default class Dialogue implements SceneState {
  _buttons: Collection<DialogueButton>;
  _prompt: string;

  constructor() {
    this._prompt = String(Math.random());
    this._buttons = new Collection<DialogueButton>([
      new DialogueButton(String(Math.random())),
      new DialogueButton(String(Math.random())),
      new DialogueButton(String(Math.random()))
    ]);
  }

  buttons(): Collection<DialogueButton> {
    return this._buttons;
  }

  prompt(): string {
    return this._prompt;
  }
}
