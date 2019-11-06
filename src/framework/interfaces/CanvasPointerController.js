// @flow

import type { CanvasPointerResponder } from "./CanvasPointerResponder";

export interface CanvasPointerController {
  addResponder<T>(CanvasPointerResponder<T>): void;

  begin(): void;

  deleteResponder<T>(CanvasPointerResponder<T>): void;

  hasResponder<T>(CanvasPointerResponder<T>): boolean;
}
