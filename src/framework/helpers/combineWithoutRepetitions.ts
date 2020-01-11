// @flow strict

export default function* combineWithoutRepetitions<T>(comboOptions: $ReadOnlyArray<T>, comboLength: number): Generator<$ReadOnlyArray<T>, void, void> {
  if (comboLength === 1) {
    for (let currentOption of comboOptions) {
      yield [currentOption];
    }
  }

  for (let optionIndex = 0; optionIndex < comboOptions.length; optionIndex += 1) {
    const currentOption: T = comboOptions[optionIndex];
    const smallerCombos = combineWithoutRepetitions(comboOptions.slice(optionIndex + 1), comboLength - 1);

    for (let smallerCombo of smallerCombos) {
      yield [currentOption, ...smallerCombo];
    }
  }
}
