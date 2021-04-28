import { UserDataHandle } from "./UserDataHandle";

import type { UserDataHandle as IUserDataHandle } from "./UserDataHandle.interface";
import type { UserDataRegistry as IUserDataRegistry } from "./UserDataRegistry.interface";

export function UserDataRegistry(): IUserDataRegistry {
  const _handles: Map<string, IUserDataHandle> = new Map();
  const _indicesMap: Map<number, string> = new Map();

  let _currentIndex: number = 0;

  function createHandleById(id: string): IUserDataHandle {
    if (_handles.has(id)) {
      throw new Error(`UserDataHandle is already registered for id: "${id}"`);
    }

    _currentIndex += 1;

    const handle = UserDataHandle(id, _currentIndex);

    _handles.set(id, handle);
    _indicesMap.set(_currentIndex, id);

    return handle;
  }

  function disposeHandleById(id: string): void {
    _indicesMap.delete(getUserIndexById(id));
    _handles.delete(id);
  }

  function getHandleById(id: string): IUserDataHandle {
    const handle: undefined | IUserDataHandle = _handles.get(id);

    if (!handle) {
      throw new Error(`There is no data handle with id: "${id}"`);
    }

    return handle;
  }

  function getHandleByUserIndex(userIndex: number): IUserDataHandle {
    return getHandleById(getIdByUserIndex(userIndex));
  }

  function getIdByUserIndex(userIndex: number): string {
    const id: undefined | string = _indicesMap.get(userIndex);

    if (!hasIdByUserIndex(userIndex) || !id) {
      throw new Error(`User index is not used: "${userIndex}"`);
    }

    return id;
  }

  function getUserIndexById(id: string): number {
    for (let [userIndex, storedId] of _indicesMap) {
      if (storedId === id) {
        return userIndex;
      }
    }

    throw new Error(`Id is not registered: "${id}"`);
  }

  function hasIdByUserIndex(userIndex: number): boolean {
    return _indicesMap.has(userIndex);
  }

  return Object.freeze({
    isUserDataRegistry: true,

    createHandleById: createHandleById,
    disposeHandleById: disposeHandleById,
    getHandleById: getHandleById,
    getHandleByUserIndex: getHandleByUserIndex,
    getIdByUserIndex: getIdByUserIndex,
    getUserIndexById: getUserIndexById,
    hasIdByUserIndex: hasIdByUserIndex,
  });
}
