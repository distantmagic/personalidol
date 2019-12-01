// @flow

import * as React from "react";
import { useParams, Redirect } from "react-router-dom";

import CancelToken from "../framework/classes/CancelToken";
import CharacterQuery from "../framework/classes/Query/Character";
import ModalCharacter from "./ModalCharacter";
import ModalLoader from "./ModalLoader";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function ModalCharacterLoader(props: Props) {
  const params = useParams();
  const [state, setState] = React.useState({
    character: null,
    isLoading: true,
  });

  React.useEffect(
    function() {
      const characterId = params.characterId;

      setState({
        character: null,
        isLoading: !!characterId,
      });

      if (!characterId) {
        return;
      }

      const cancelToken = new CancelToken(props.loggerBreadcrumbs.add("CharacterQuery"));
      const query = new CharacterQuery(characterId);

      props.queryBus.enqueue(cancelToken, query).then(character => {
        setState({
          character: character,
          isLoading: false,
        });
      });

      return function() {
        cancelToken.cancel(props.loggerBreadcrumbs.add("React.useEffect").add("cleanup"));
      };
    },
    [props.exceptionHandler, props.loggerBreadcrumbs, params.characterId, props.queryBus]
  );

  if (state.isLoading) {
    return <ModalLoader label="Loading character" />;
  }

  const character = state.character;

  if (!character) {
    return <Redirect to="/" />;
  }

  return <ModalCharacter character={character} />;
}
