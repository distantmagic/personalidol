import { Fragment, h } from "preact";

import { renderDOMLoadingScreen } from "./renderDOMLoadingScreen";

import type { ComponentChild } from "preact";

type RenderMessage = {
  data: any;
  route: string;
};

function renderDOMUIRoute(route: string, data: any): null | ComponentChild {
  switch (route) {
    case "/loading-screen":
      return renderDOMLoadingScreen(data);
    default:
      return null;
  }
}

export function renderDOMUIRouter({ route, data }: RenderMessage): ComponentChild {
  return (
    <div class="pi">
      {renderDOMUIRoute(route, data)}
    </div>
  );
}
