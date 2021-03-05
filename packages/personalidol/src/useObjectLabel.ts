import { CSS2DObject } from "@personalidol/three-renderer/src/CSS2DObject";

import { isEntityWithObjectLabel } from "./isEntityWithObjectLabel";

import type { Object3D } from "three/src/core/Object3D";

// import type { CSS2DObject as ICSS2DObject } from "@personalidol/three-renderer/src/CSS2DObject.interface";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

import type { AnyEntity } from "./AnyEntity.type";

export function useObjectLabel(
  domMessagePort: MessagePort,
  parent: Object3D,
  entity: AnyEntity,
  mountables: Set<MountableCallback>,
  unmountables: Set<UnmountableCallback>,
  disposables: Set<DisposableCallback>
): void {
  if (!isEntityWithObjectLabel(entity)) {
    return;
  }

  const label = new CSS2DObject(domMessagePort, "pi-object-label", {
    label: entity.properties.label,
  });

  mountables.add(function () {
    parent.add(label);
  });

  unmountables.add(function () {
    parent.remove(label);
  });
}
