// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import Dialogue from "../framework/classes/Dialogue";
import DialogueMessage from "../framework/classes/DialogueMessage";
import { default as CancelledException } from "../framework/classes/Exception/Cancelled";
import { default as DialogueComponent } from "./Dialogue";
import { default as DialogueQuery } from "../framework/classes/Query/Dialogue";
import { default as DialogueResourceReference } from "../framework/classes/ResourceReference/Dialogue";

import type { Collection } from "../framework/interfaces/Collection";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {
  cancelToken: CancelToken,
  dialogueResourceReference: DialogueResourceReference,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
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
      new DialogueQuery(
        reference,
        this.props.expressionBus,
        this.props.expressionContext
      )
    );
    const message = dialogue.start();

    await this.props.expressionBus.expressible(message);

    const [actor, answers, prompt] = await Promise.all([
      message.actor(),
      message.answers(),
      message.prompt()
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

    if (
      "string" !== typeof actor ||
      "string" !== typeof prompt ||
      !answers ||
      !dialogue ||
      !message
    ) {
      return <div>Loading...</div>;
    }

    return (
      <DialogueComponent
        actor={actor}
        answers={answers}
        dialogue={dialogue}
        expressionBus={this.props.expressionBus}
        expressionContext={this.props.expressionContext.set(
          "dialogue",
          dialogue
        )}
        message={message}
        prompt={prompt}
        queryBus={this.props.queryBus}
      />
    );
  }
}
