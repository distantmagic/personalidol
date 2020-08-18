import { h } from "preact";

import { renderDOMLoadingScreen } from "./renderDOMLoadingScreen";
import { renderDOMLoadingScreenError } from "./renderDOMLoadingScreenError";

import type { ComponentChild } from "preact";

type RenderMessage = {
  data: any;
  route: null | string;
};

function renderDOMUIRoute(route: null | string, data: any): null | ComponentChild {
  switch (route) {
    case "/loading-screen":
      return renderDOMLoadingScreen(data);
    case "/loading-screen/error":
      return renderDOMLoadingScreenError(data);
    case "/map":
      return <div>xd</div>;
    case null:
      return null;
    default:
      throw new Error(`Unknown route: "${route}"`);
  }
}

export function renderDOMUIRouter({ route, data }: RenderMessage): ComponentChild {
  return (
    <div class="pi">
      {renderDOMUIRoute(route, data)}
    </div>
  );
}
