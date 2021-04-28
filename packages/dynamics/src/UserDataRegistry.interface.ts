import type { UserDataHandle } from "./UserDataHandle.interface";

export interface UserDataRegistry {
  readonly isUserDataRegistry: true;

  createHandleById(id: string): UserDataHandle;

  disposeHandleById(id: string): void;

  getHandleById(id: string): UserDataHandle;

  getHandleByUserIndex(userIndex: number): UserDataHandle;

  getIdByUserIndex(userIndex: number): string;

  getUserIndexById(id: string): number;

  hasIdByUserIndex(userIndex: number): boolean;
}
