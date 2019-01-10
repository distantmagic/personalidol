// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import Dialogue from "../framework/classes/Dialogue";
import DialogueMessage from "../framework/classes/DialogueMessage";
import QueryBus from "../framework/classes/QueryBus";
import { default as CancelledException } from "../framework/classes/Exception/Cancelled";
import { default as DialogueComponent } from "./Dialogue";
import { default as DialogueQuery } from "../framework/classes/Query/Dialogue";
import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

import type { Collection } from "../framework/interfaces/Collection";

type Props = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  queryBus: QueryBus
};

type State = {
  actor: ?string,
  answers: ?Collection<DialogueMessage>,
  dialogue: ?Dialogue,
  message: ?DialogueMessage,
  prompt: ?string
};

export default class DialogueController extends React.Component<Props, State> {
  state = {
    actor: null,
    answers: null,
    dialogue: null,
    message: null,
    prompt: null
  };

  async componentDidMount() {
    try {
      await this.loadDialogue(this.props.dialogueResourceReference);
    } catch (e) {
      if (!(e instanceof CancelledException)) {
        console.error(e);
      }
    }
  }

  async loadDialogue(reference: DialogueResourceReference) {
    const dialogue = await this.props.queryBus.enqueue(
      this.props.cancelToken,
      new DialogueQuery(reference)
    );
    const message = dialogue.initialMessage();

    const [actor, answers, prompt] = await Promise.all([
      message.actor(this.props.queryBus),
      message.answers(this.props.queryBus),
      message.prompt(this.props.queryBus)
    ]);

    this.setState({
      actor: actor,
      answers: answers,
      dialogue: dialogue,
      message: message,
      prompt: prompt
    });
  }

  render() {
    const { actor, dialogue, message, answers, prompt } = this.state;

    if (!actor || !answers || !dialogue || !message || !prompt) {
      return <div>Loading...</div>;
    }

    return (
      <DialogueComponent
        actor={actor}
        answers={answers}
        dialogue={dialogue}
        message={message}
        prompt={prompt}
        queryBus={this.props.queryBus}
      />
    );
  }
}
