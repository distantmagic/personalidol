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
    grid-row-gap: 0.4rem;
    grid-template-areas:
      "bullets bullets"
      "label-edge-low label-edge-high"
    ;
    padding-left: 1.6rem;
    padding-right: 1.6rem;
  }

  .pi-slider-bullets {
    background-color: black;
    border: 1px solid white;
    border-radius: 1rem;
    display: grid;
    grid-area: bullets;
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

  .pi-slider-edge-label.pi-slider-edge-label--low {
    grid-area: label-edge-low;
  }

  .pi-slider-edge-label.pi-slider-edge-label--high {
    grid-area: label-edge-high;
    text-align: right;
  }
`;

export function SliderComponent<T>(props: Props<T>) {
  if (props.labels.length !== props.values.length) {
    throw new Error("Labels and values arrays need to have equal length.");
  }

  return (
    <div class="pi-slider">
      <div class="pi-slider-edge-label pi-slider-edge-label--low">{props.edgeLabels[0]}</div>
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
              draggable={false}
              key={String(value)}
              onClick={
                props.values.length > 2
                  ? function (evt) {
                      evt.preventDefault();
                      props.onChange(value);
                    }
                  : function (evt) {
                      evt.preventDefault();

                      if (props.currentValue === props.values[0]) {
                        props.onChange(props.values[1]);
                      } else {
                        props.onChange(props.values[0]);
                      }
                    }
              }
            >
              {String(props.labels[index])}
            </div>
          );
        })}
      </div>
      <div class="pi-slider-edge-label pi-slider-edge-label--high">{props.edgeLabels[1]}</div>
    </div>
  );
}
