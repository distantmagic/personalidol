export interface FormRadioButtonsDOMElementProps<T> {
  currentValue: T;
  edgeLabels: [string, string];
  labels: ReadonlyArray<string>;
  values: ReadonlyArray<T>;
}
