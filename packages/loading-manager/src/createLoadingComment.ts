import type { LoadingManagerItem } from "./LoadingManagerItem.type";

function _isLoaded(itemsLoaded: Set<LoadingManagerItem>, itemToCheck: LoadingManagerItem): boolean {
  for (let item of itemsLoaded) {
    if (item.id === itemToCheck.id) {
      return true;
    }
  }

  return false;
}

export function createLoadingComment(itemsLoaded: Set<LoadingManagerItem>, itemsToLoad: Set<LoadingManagerItem>): string {
  const resources: {
    [key: string]: Array<string>;
  } = {};
  let comment: Array<string> = [];

  for (let item of itemsToLoad) {
    if (!_isLoaded(itemsLoaded, item)) {
      if (!resources.hasOwnProperty(item.resourceType)) {
        resources[item.resourceType] = [];
      }

      resources[item.resourceType].push(item.resourceUri);
    }
  }

  const resourceTypes = Object.keys(resources).sort();
  const shouldAlwaysGroup = resourceTypes.length > 2;

  for (let resourceType of resourceTypes) {
    if (resources[resourceType].length > 1) {
      comment.push(`${resources[resourceType].length} ${resourceType}s`);
    } else {
      if (shouldAlwaysGroup) {
        comment.push(`${resourceType}`);
      } else {
        comment.push(`${resourceType} ${resources[resourceType][0]}`);
      }
    }
  }

  return comment.join(", ");
}
