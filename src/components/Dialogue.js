// @flow

import * as React from "react";

import DialogueButton from "./DialogueButton";
import { default as DialogueSceneState } from "../framework/classes/SceneState/Dialogue";

type Props = {
  sceneState: DialogueSceneState
};

type State = {};

export default class Dialogue extends React.Component<Props, State> {
  render() {
    return (
      <div>
        {this.props.sceneState.prompt()}
        <ol>
          {this.props.sceneState.buttons().map(button => (
            <li key={button}>
              <DialogueButton button={button} />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
