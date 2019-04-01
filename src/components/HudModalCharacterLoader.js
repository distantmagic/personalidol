// @flow

import * as React from "react";
import { Redirect } from "react-router-dom";

import CancelToken from "../framework/classes/CancelToken";
import CharacterQuery from "../framework/classes/Query/Character";
import CharacterResourceReference from "../framework/classes/ResourceReference/Character";
import HudModalCharacter from "./HudModalCharacter";
import HudModalLoader from "./HudModalLoader";

import type { Match } from "react-router";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger,
  match: Match,
  queryBus: QueryBus
|};

export default function HudModalCharacterLoader(props: Props) {
  const [state, setState] = React.useState({
    character: null,
    isLoading: true
  });

  React.useEffect(
    function() {
      const characterId = props.match.params.characterId;

      setState({
        character: null,
        isLoading: !!characterId
      });

      if (!characterId) {
        return;
      }

      const cancelToken = new CancelToken();
      const query = new CharacterQuery(
        new CharacterResourceReference(characterId)
      );

      props.queryBus
        .enqueue(cancelToken, query)
        .then(character =>
          setState({
            character: character,
            isLoading: false
          })
        )
        .catch(props.logger.error);

      return function() {
        cancelToken.cancel();
      };
    },
    [props.match.params.characterId]
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
