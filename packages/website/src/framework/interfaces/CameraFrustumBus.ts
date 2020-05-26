import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";
import type CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import type CancelToken from "src/framework/interfaces/CancelToken";

export default interface CameraFrustumBus extends AnimatableUpdatable {
  add(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void>;

  delete(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void>;
}
