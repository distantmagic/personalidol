/**
 * Since collision flags are not translated from the original bullet source
 * files, this enum is here.
 */
export enum CollisionFlags {
  CF_STATIC_OBJECT = 1,
  CF_KINEMATIC_OBJECT = 2,
  CF_NO_CONTACT_RESPONSE = 4,
  CF_CUSTOM_MATERIAL_CALLBACK = 8,
  CF_CHARACTER_OBJECT = 16,
  CF_DISABLE_VISUALIZE_OBJECT = 32,
  CF_DISABLE_SPU_COLLISION_PROCESSING = 64,
  CF_HAS_CONTACT_STIFFNESS_DAMPING = 128,
  CF_HAS_CUSTOM_DEBUG_RENDERING_COLOR = 256,
  CF_HAS_FRICTION_ANCHOR = 512,
  CF_HAS_COLLISION_SOUND_TRIGGER = 1024,
}