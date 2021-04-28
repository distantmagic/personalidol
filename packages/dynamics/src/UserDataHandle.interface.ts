export interface UserDataHandle {
  readonly data: Map<any, any>;
  readonly isUserDataHandle: true;
  readonly simulantId: string;
  readonly userIndex: number;
}
