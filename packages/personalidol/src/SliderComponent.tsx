import classnames from "classnames";
import { h } from "preact";

type Props<T> = {
  currentValue: T;
  edgeLabels: [string, string];
  labels: ReadonlyArray<string>;
  onChange: (value: T) => void;
  values: ReadonlyArray<T>;
};

SliderComponent.css = `
  .pi-slider {
    align-items: center;
    display: grid;
    grid-column-gap: 1rem;
    grid-template-columns: 4ch 1fr 4ch;
  }

  .pi-slider-bullets {
    background-color: black;
    border-radius: 1rem;
    display: grid;
    grid-column-gap: 2px;
    padding: 2px;
  }

  .pi-slider-bullet {
    align-items: center;
    border-radius: 1rem;
    color: white;
    cursor: pointer;
    display: grid;
    height: 2rem;
    justify-content: center;
    line-height: 1px;
    padding: 0 1ch;
    text-align: center;
    vertical-align: center;
  }

  .pi-slider-bullet.pi-slider-bullet--active {
    background-color: white;
    color: black;
  }
`;

export function SliderComponent<T>(props: Props<T>) {
  if (props.labels.length !== props.values.length) {
    throw new Error("Labels and values arrays need to have equal length.");
  }

  return (
    <div class="pi-slider">
      <div class="pi-slider-edge-label">{props.edgeLabels[0]}</div>
      <div
        class="pi-slider-bullets"
        style={{
          "grid-template-columns": `repeat(${props.values.length}, 1fr)`,
        }}
      >
        {props.values.map(function (value: T, index: number) {
          return (
            <div
              class={classnames("pi-slider-bullet", {
                "pi-slider-bullet--active": value === props.currentValue,
                "pi-slider-bullet--inactive": value !== props.currentValue,
              })}
              draggable={true}
              key={String(value)}
              onClick={function (evt) {
                evt.preventDefault();
                props.onChange(value);
              }}
            >
              {String(props.labels[index])}
            </div>
          );
        })}
      </div>
      <div class="pi-slider-edge-label">{props.edgeLabels[1]}</div>
    </div>
  );
}
