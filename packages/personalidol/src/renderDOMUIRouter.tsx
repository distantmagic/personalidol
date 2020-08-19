import { h } from "preact";

import { LoadingScreen } from "../components/LoadingScreen";
import { LoadingErrorScreen } from "../components/LoadingErrorScreen";

import type { ComponentChild } from "preact";

import type { RoutesState } from "@personalidol/dom-renderer/src/RoutesState.type";

function renderDOMUIRoute(route: string, data: any): ComponentChild {
  switch (route) {
    case "/loading-screen":
      return LoadingScreen(data);
    case "/loading-error-screen":
      return LoadingErrorScreen(data);
    case "/map":
      return <div>xd</div>;
    default:
      throw new Error(`Unknown route: "${route}"`);
  }
}

export function renderDOMUIRouter(routesState: RoutesState): Array<ComponentChild> {
  return Object.keys(routesState).map(function (route: string) {
    return renderDOMUIRoute(route, routesState[route]);
  });
}
