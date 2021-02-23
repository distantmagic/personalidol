export interface SliderDOMElementProps<T> {
  currentValue: T;
  edgeLabels: [string, string];
  labels: ReadonlyArray<string>;
  values: ReadonlyArray<T>;
}
