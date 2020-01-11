import * as React from "react";
import { useParams } from "react-router-dom";

import CharacterQuery from "../framework/classes/Query/Character";
import memoize from "../framework/helpers/memoize";
import ModalCharacter from "./ModalCharacter";
import ModalLoader from "./ModalLoader";
import useQuery from "../effects/useQuery";

import { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "../framework/interfaces/QueryBus";

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
