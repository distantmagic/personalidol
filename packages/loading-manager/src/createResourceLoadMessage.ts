import { MathUtils } from "three/src/math/MathUtils";

import type { ProgressManagerItem } from "./ProgressManagerItem.type";

export function createResourceLoadMessage(resourceType: string, resourceURI: string, weight: number = 1): ProgressManagerItem {
  return {
    id: MathUtils.generateUUID(),
    resourceType: resourceType,
    resourceUri: resourceURI,
    weight: weight,
  };
}
