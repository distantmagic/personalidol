import { h } from "preact";

type RenderMessage = {
  route: string;
};

export function renderDOMUIRouter({ route, data }: RenderMessage) {
  return (
    <div>
      Hello, {data.planet}!
    </div>
  );
}
