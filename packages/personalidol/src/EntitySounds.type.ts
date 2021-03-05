import type { Entity } from "./Entity.type";

export type EntitySounds = Entity & {
  readonly classname: "sounds";
  readonly sounds: string;
  readonly transferables: [];
};
