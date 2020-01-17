import CancelToken from "src/framework/interfaces/CancelToken";

export default interface ClockReactiveController {
  interval(cancelToken: CancelToken): Promise<void>;
}
