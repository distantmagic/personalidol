import { MathUtils } from "three/src/math/MathUtils";

import type { MessageProgress } from "./MessageProgress.type";
import type { MessageProgressChange } from "./MessageProgressChange.type";
import type { MessageProgressDone } from "./MessageProgressDone.type";
import type { MessageProgressError } from "./MessageProgressError.type";
import type { MessageProgressStart } from "./MessageProgressStart.type";
import type { ProgressManager as IProgressManager } from "./ProgressManager.interface";
import type { ProgressManagerState } from "./ProgressManagerState.type";

function _messageToString(message: MessageProgress): string {
  return `MessageProgress("${message.type}", "${message.uri}", "${message.id}")`;
}

export function ProgressManager(): IProgressManager {
  const state: ProgressManagerState = Object.seal({
    expect: 0,
    errors: [],
    messages: [],
    version: 0,
  });

  const _currentErrors: Map<string, MessageProgressError> = new Map();
  const _currentlyLoading: Map<string, MessageProgressChange> = new Map();

  function _updateState(): void {
    state.errors = Array.from(_currentErrors.values());
    state.messages = Array.from(_currentlyLoading.values());
    state.version += 1;
  }

  function done(message: MessageProgressDone): void {
    if (!_currentlyLoading.has(message.id)) {
      throw new Error(`Item is done loading, but it has never started: ${_messageToString(message)}`);
    }

    _currentlyLoading.set(message.id, <MessageProgressChange>message);
    _updateState();
  }

  function error(message: MessageProgressError): void {
    _currentErrors.set(message.id, message);
    _updateState();
  }

  function expect(expect: number): void {
    state.expect = expect;
    _updateState();
  }

  function progress(message: MessageProgressChange): void {
    if (!_currentlyLoading.has(message.id)) {
      throw new Error(`Item load is progressing, but it has never started: ${_messageToString(message)}`);
    }

    _currentlyLoading.set(message.id, <MessageProgressChange>message);
    _updateState();
  }

  function reset(): void {
    state.expect = 0;
    _currentErrors.clear();
    _currentlyLoading.clear();
    _updateState();
  }

  function start(message: MessageProgressStart): void {
    if (_currentlyLoading.has(message.id)) {
      throw new Error(`Items is already started: ${_messageToString(message)}`);
    }

    _currentlyLoading.set(message.id, <MessageProgressChange>{
      ...message,
      loaded: 0,
      total: 1,
    });

    _updateState();
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "ProgressManager",
    state: state,

    done: done,
    error: error,
    expect: expect,
    progress: progress,
    reset: reset,
    start: start,
  });
}
