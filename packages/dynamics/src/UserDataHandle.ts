import { UserDataHandle as IUserDataHandle } from "./UserDataHandle.interface";

export function UserDataHandle(id: string, userIndex: number): IUserDataHandle {
  return Object.freeze({
    data: new Map(),
    isUserDataHandle: true,
    simulantId: id,
    userIndex: userIndex,
  });
}
