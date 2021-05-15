export enum CameraParameters {
  ZOOM_DEFAULT = 201,
  ZOOM_MAX = 1,
  ZOOM_MIN = 1401,
  // When zoom increments are discrete, like when using mouse scroll wheel.
  ZOOM_STEP = 50,
  // When zoom is fluent and changes every frame, for example when using
  // keyboard.
  ZOOM_VELOCITY = 3500,
}
