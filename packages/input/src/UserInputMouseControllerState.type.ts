import { UserInputControllerState } from "./UserInputControllerState.type";

export type UserInputMouseControllerState = UserInputControllerState & {
  isPressStarted: boolean;
  isPressStartedWithIntersection: boolean;
};
