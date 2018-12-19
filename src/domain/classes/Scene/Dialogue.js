// @flow

import Scene from "../../../framework/classes/Scene";
import { default as DialogueSceneState } from "../SceneState/Dialogue";

export default class Dialogue extends Scene<DialogueSceneState> {
  constructor() {
    super();

    this.setSceneState(new DialogueSceneState());

    setInterval(() => {
      this.setSceneState(new DialogueSceneState());
    }, 1000);
  }
}
