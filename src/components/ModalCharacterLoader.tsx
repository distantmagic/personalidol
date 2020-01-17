import * as React from "react";
import { useParams } from "react-router-dom";

import ModalCharacter from "src/components/ModalCharacter";
import ModalLoader from "src/components/ModalLoader";

import useQuery from "src/effects/useQuery";

import memoize from "src/framework/helpers/memoize";

import CharacterQuery from "src/framework/classes/Query/Character";

import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";

type Props = {
  exceptionHandler: ExceptionHandler;
  loggerBreadcrumbs: LoggerBreadcrumbs;
  queryBus: QueryBus;
};

function createCharacterQuery(characterId: undefined | string): null | CharacterQuery {
  if (!characterId) {
    return null;
  }

  return new CharacterQuery(characterId);
}

export default function ModalCharacterLoader(props: Props) {
  const params = useParams<{
    characterId?: string;
  }>();

  // prettier-ignore
  const character = useQuery(
    props.exceptionHandler,
    props.loggerBreadcrumbs.add("ModalCharacterLoader"),
    props.queryBus,
    memoize<CharacterQuery, [undefined | string]>(createCharacterQuery, [params.characterId])
  );

  if (!character || !character.isExecuted()) {
    return <ModalLoader comment="Loading character" />;
  }

  return <ModalCharacter character={character.getResult()} />;
}
