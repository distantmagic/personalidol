import type { AnyEntity } from "./AnyEntity.type";
import type { EntityWithController } from "./EntityWithController.type";

export function isEntityWithController(entity: AnyEntity): entity is EntityWithController {
  return "string" === typeof entity.properties.controller;
}
