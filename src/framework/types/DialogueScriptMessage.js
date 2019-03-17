// @flow

export type DialogueScriptMessage = {
  actor: string,
  answer_to?: string | Array<string>,
  condition?: string,
  expression?: string,
  illustration?: string,
  prompt: string
};
