import * as React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";

import ModalCharacterLoader from "src/components/ModalCharacterLoader";
import ModalRouterNotFound from "src/components/ModalRouterNotFound";
import ModalSettings from "src/components/ModalSettings";

import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "src/framework/interfaces/QueryBus";

type Props = {
  exceptionHandler: ExceptionHandler;
  loggerBreadcrumbs: LoggerBreadcrumbs;
  queryBus: QueryBus;
};

export default React.memo<Props>(function ModalOverlay(props: Props) {
  const history = useHistory();
  const location = useLocation();

  function onOverlayClick(evt: React.SyntheticEvent<HTMLElement>): void {
    evt.preventDefault();

    history.push("/");
  }

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="dd__modal">
      <div className="dd__modal__overlay" onClick={onOverlayClick} />
      <Switch>
        <Route path="/character/:characterId">
          <ModalCharacterLoader exceptionHandler={props.exceptionHandler} loggerBreadcrumbs={props.loggerBreadcrumbs.add("ModalCharacterLoader")} queryBus={props.queryBus} />
        </Route>
        <Route path="/settings">
          <ModalSettings />
        </Route>
        <Route component={ModalRouterNotFound} />
      </Switch>
    </div>
  );
});
