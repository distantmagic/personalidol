// @flow

import React from "react";

import DialogueContext from "../domain/DialogueContext";
import DialogueMessage from "./DialogueMessage";
import DialogueParser from "../domain/DialogueParser";
import { default as DialogueModel } from "../domain/Dialogue";

type Props = {};

type State = {
  dialogue: ?DialogueModel
};

export default class Dialogue extends React.Component<Props, State> {
  state = {
    dialogue: null
  };

  async componentWillMount() {
    const response = await fetch("dialogues/0001-welcome.yaml");
    const content = await response.text();

    const dialogueContext = new DialogueContext();
    const dialogueParser = new DialogueParser(content);
    const dialogue = await dialogueParser.parse(dialogueContext);

    this.setState({
      dialogue: dialogue
    });
  }

  render() {
    if (!this.state.dialogue) {
      return "Waiting for a dialogue...";
    }

    return (
      <ul>
        {this.state.dialogue.getMessages().map((message, index) => (
          <DialogueMessage key={index} message={message} />
        ))}
      </ul>
    );
  }
}
