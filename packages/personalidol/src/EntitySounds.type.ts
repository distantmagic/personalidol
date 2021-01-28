import type { BaseEntity } from "./BaseEntity.type";

export type EntitySounds = BaseEntity & {
  readonly classname: "sounds";
  readonly sounds: string;
  readonly transferables: [];
};
