// @flow

import * as React from "react";
import autoBind from "auto-bind";
import classnames from "classnames";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import HudScene from "./HudScene";
import HudToolbar from "./HudToolbar";
import Person from "../framework/classes/Entity/Person";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger
|};

type State = {|
  dialogueBoxSize: 1 | 2 | 3,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  error: ?Error,
  queryBus: QueryBusInterface,
  queryBusController: QueryBusController
|};

export default class Main extends React.Component<Props, State> {
  cancelToken: CancelToken;

  constructor(props: Props) {
    super(props);

    autoBind.react(this);

    const queryBus = new QueryBus();

    this.cancelToken = new CancelToken();
    this.state = {
      dialogueBoxSize: 1,
      expressionBus: new ExpressionBus(),
      expressionContext: new ExpressionContext(),
      error: null,
      queryBus: queryBus,
      queryBusController: new QueryBusController(new BusClock(), queryBus)
    };
  }

  componentDidCatch(error: Error, errorInfo: Object): void {
    this.setState({
      error: error
    });
  }

  componentDidMount(): void {
    this.state.queryBusController.interval(this.cancelToken);
  }

  componentWillUnmount(): void {
    this.cancelToken.cancel();
  }

  onDialogueBoxSizeDecrease() {
    if (3 === this.state.dialogueBoxSize) {
      this.setDialogueBoxSize(2);
    } else if (2 === this.state.dialogueBoxSize) {
      this.setDialogueBoxSize(1);
    }
  }

  onDialogueBoxSizeIncrease() {
    if (1 === this.state.dialogueBoxSize) {
      this.setDialogueBoxSize(2);
    } else if (2 === this.state.dialogueBoxSize) {
      this.setDialogueBoxSize(3);
    }
  }

  setDialogueBoxSize(dialogueBoxSize: $PropertyType<State, "dialogueBoxSize">) {
    this.setState({
      dialogueBoxSize: dialogueBoxSize
    });
  }

  render() {
    return (
      <div
        className={classnames("dd__container", "dd__hud", {
          "dd__hud--dialogue-small": 1 === this.state.dialogueBoxSize,
          "dd__hud--dialogue-medium": 2 === this.state.dialogueBoxSize,
          "dd__hud--dialogue-huge": 3 === this.state.dialogueBoxSize
        })}
      >
        <div className="dd__aside dd__aside--hud" />
        <div className="dd__dialogue dd__dialogue--hud">
          <DialogueLoader
            dialogueResourceReference={
              new DialogueResourceReference("/data/dialogues/test-dialogue.yml")
            }
            dialogueInitiator={new Person("Laelaps")}
            expressionBus={this.state.expressionBus}
            expressionContext={this.state.expressionContext}
            logger={this.props.logger}
            onDialogueBoxSizeDecrease={this.onDialogueBoxSizeDecrease}
            onDialogueBoxSizeIncrease={this.onDialogueBoxSizeIncrease}
            queryBus={this.state.queryBus}
          />
        </div>
        <HudScene />
        <div className="dd__statusbar dd__statusbar--hud">
          Thalantyr: szansa na zadanie obrażeń 56%. Intuicja podpowiada ci, że
          będzie przyjaźnie nastawiony.
        </div>
        <HudToolbar />
      </div>
    );
  }
}
