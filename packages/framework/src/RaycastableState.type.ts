export type RaycastableState = {
  isRayIntersecting: boolean;
  // Can be set to false to be permanently removed from the raycast pool.
  needsRaycast: boolean;
};
