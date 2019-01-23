// @flow

export type DialogueScriptMessage = {
  actor: string,
  answer_to?: string | Array<string>,
  expression?: string,
  prompt: string
};
