// @flow

import * as React from "react";

import DialogueAnswerController from "./DialogueAnswerController";
import DialogueMessage from "../framework/classes/DialogueMessage";
import QueryBus from "../framework/classes/QueryBus";
import { default as DialogueModel } from "../framework/classes/Dialogue";

import type { Collection } from "../framework/interfaces/Collection";

type Props = {
  actor: string,
  answers: Collection<DialogueMessage>,
  dialogue: DialogueModel,
  message: DialogueMessage,
  prompt: string,
  queryBus: QueryBus
};

type State = {};

export default class Dialogue extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <strong>{this.props.actor}</strong>
        {" - "}
        {this.props.prompt}
        <ol>
          {this.props.answers.map(answer => (
            <li key={answer.key()}>
              <DialogueAnswerController
                answer={answer}
                queryBus={this.props.queryBus}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
