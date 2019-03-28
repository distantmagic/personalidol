// @flow

import * as React from "react";
import classnames from "classnames";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import HudAside from "./HudAside";
import HudModalRouter from "./HudModalRouter";
import HudScene from "./HudScene";
import HudToolbar from "./HudToolbar";
import Person from "../framework/classes/Entity/Person";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { Logger } from "../framework/interfaces/Logger";
// import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger
|};

export default function Main(props: Props) {
  const [cancelToken] = React.useState(new CancelToken());
  const [expressionBus] = React.useState(new ExpressionBus());
  const [expressionContext] = React.useState(new ExpressionContext());
  const [queryBus] = React.useState(new QueryBus());
  const [queryBusController] = React.useState(
    new QueryBusController(new BusClock(), queryBus)
  );

  React.useEffect(
    function() {
      queryBusController.interval(cancelToken);

      return function() {
        cancelToken.cancel();
      };
    },
    [cancelToken, queryBusController]
  );

  return (
    <div className={classnames("dd__container", "dd__hud")}>
      <HudAside />
      <DialogueLoader
        dialogueResourceReference={
          new DialogueResourceReference("/data/dialogues/hermit-intro.yml")
        }
        dialogueInitiator={new Person("Laelaps")}
        expressionBus={expressionBus}
        expressionContext={expressionContext}
        logger={props.logger}
        queryBus={queryBus}
      />
      <HudScene />
      <div className="dd__frame dd__statusbar dd__statusbar--hud">
        Thalantyr: szansa na zadanie obrażeń 56%. Intuicja podpowiada ci, że
        będzie przyjaźnie nastawiony.
      </div>
      <HudToolbar />
      <HudModalRouter />
    </div>
  );
}
