// @flow

import * as React from "react";

import Scene from "./Scene";
import { default as DialogueScene } from "../domain/classes/Scene/Dialogue";

type Props = {};

type State = {
  dialogueScene: DialogueScene,
  error: ?Error
};

export default class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dialogueScene: new DialogueScene(),
      error: null
    };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  render() {
    return (
      <div>
        <Scene dialogueScene={this.state.dialogueScene} />
        <Scene dialogueScene={this.state.dialogueScene} />
        <Scene dialogueScene={this.state.dialogueScene} />
      </div>
    );
  }
}
