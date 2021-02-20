import { h } from "preact";

import type { ComponentChildren } from "preact";

type Props<T> = {
  children: ComponentChildren;
  id?: string;
  onClick: () => void;
};

ButtonComponent.css = `
  .pi-button {
    background-color: transparent;
    border: 1px solid white;
    color: white;
    cursor: pointer;
    font-family: Mukta;
    font-size: 1rem;
    line-height: 1;
    padding: 0.8rem 1.6rem;
    -webkit-user-select: none;
    user-select: none;
  }
`;

export function ButtonComponent<T>(props: Props<T>) {
  return (
    <button
      class="pi-button"
      id={props.id}
      onClick={function (evt) {
        evt.preventDefault();

        props.onClick();
      }}
    >
      {props.children}
    </button>
  );
}
