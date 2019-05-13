// @flow

export type DialogueScriptMessage = {
  actor: string,
  answer_to?: string | $ReadOnlyArray<string>,
  condition?: string,
  expression?: string,
  illustration?: string,
  prompt: string
};
