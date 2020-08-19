import { LoadingScreen } from "../components/LoadingScreen";
import { LoadingErrorScreen } from "../components/LoadingErrorScreen";
import { MainMenuScreen } from "../components/MainMenuScreen";

import type { ComponentChild } from "preact";

import type { RoutesState } from "@personalidol/dom-renderer/src/RoutesState.type";

function renderDOMUIRoute(route: string, data: any): ComponentChild {
  switch (route) {
    case "/loading-screen":
      return LoadingScreen(data);
    case "/loading-error-screen":
      return LoadingErrorScreen(data);
    case "/main-menu":
      return MainMenuScreen();
    default:
      throw new Error(`Unknown route: "${route}"`);
  }
}

export function renderDOMUIRouter(routesState: RoutesState): Array<ComponentChild> {
  return Object.keys(routesState).map(function (route: string) {
    return renderDOMUIRoute(route, routesState[route]);
  });
}
