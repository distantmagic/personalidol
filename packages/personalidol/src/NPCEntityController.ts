import type { EntityController } from "./EntityController.interface";

export function NPCEntityController(): EntityController {
  return Object.freeze({
    isEntityController: true,
  });
}
