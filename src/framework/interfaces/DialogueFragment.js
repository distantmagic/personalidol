// @flow

export interface DialogueFragment {
  prompt(): Promise<string>;
}
