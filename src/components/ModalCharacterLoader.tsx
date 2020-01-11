// @flow strict

import * as React from "react";
import { useParams } from "react-router-dom";

import CharacterQuery from "../framework/classes/Query/Character";
import memoize from "../framework/helpers/memoize";
import ModalCharacter from "./ModalCharacter";
import ModalLoader from "./ModalLoader";
import useQuery from "../effects/useQuery";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

function createCharacterQuery(characterId: ?string): ?CharacterQuery {
  if (!characterId) {
    return null;
  }

  return new CharacterQuery(characterId);
}

export default function ModalCharacterLoader(props: Props) {
  const params = useParams();
  const character = useQuery(props.exceptionHandler, props.loggerBreadcrumbs.add("ModalCharacterLoader"), props.queryBus, memoize(createCharacterQuery, [params.characterId]));

  if (!character || !character.isExecuted()) {
    return <ModalLoader comment="Loading character" />;
  }

  return <ModalCharacter character={character.getResult()} />;
}
