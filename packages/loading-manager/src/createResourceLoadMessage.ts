import { MathUtils } from "three/src/math/MathUtils";

import type { LoadingManagerItem } from "./LoadingManagerItem.type";

export function createResourceLoadMessage(resourceType: string, resourceURI: string, weight: number = 1): LoadingManagerItem {
  return {
    id: MathUtils.generateUUID(),
    resourceType: resourceType,
    resourceUri: resourceURI,
    weight: weight,
  };
}
