import type { ReusedResponsesCache } from "./ReusedResponsesCache.type";

export function createReusedResponsesCache(): ReusedResponsesCache {
  return new Map();
}
