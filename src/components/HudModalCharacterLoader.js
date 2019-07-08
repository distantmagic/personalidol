// @flow

import * as React from "react";
import { Redirect } from "react-router-dom";

import CancelToken from "../framework/classes/CancelToken";
import CharacterQuery from "../framework/classes/Query/Character";
import HudModalCharacter from "./HudModalCharacter";
import HudModalLoader from "./HudModalLoader";

import type { Match } from "react-router";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  match: Match,
  queryBus: QueryBus,
|};

export default function HudModalCharacterLoader(props: Props) {
  const [state, setState] = React.useState({
    character: null,
    isLoading: true,
  });

  React.useEffect(
    function() {
      const characterId = props.match.params.characterId;

      setState({
        character: null,
        isLoading: !!characterId,
      });

      if (!characterId) {
        return;
      }

      const cancelToken = new CancelToken(props.loggerBreadcrumbs.add("CharacterQuery"));
      const query = new CharacterQuery(characterId);

      props.queryBus
        .enqueue(cancelToken, query)
        .then(character =>
          setState({
            character: character,
            isLoading: false,
          })
        )
        .catch((error: Error) => {
          return props.exceptionHandler.captureException(props.loggerBreadcrumbs.add("characterQuery"), error);
        });

      return function() {
        cancelToken.cancel(props.loggerBreadcrumbs.add("React.useEffect").add("cleanup"));
      };
    },
    [props.exceptionHandler, props.loggerBreadcrumbs, props.match.params.characterId, props.queryBus]
  );

  if (state.isLoading) {
    return <HudModalLoader label="Loading character" />;
  }

  const character = state.character;

  if (!character) {
    return <Redirect to="/" />;
  }

  return <HudModalCharacter character={character} />;
}
