export function isPromise(item: any): item is Promise<any> {
  if ("object" !== typeof item) {
    return false;
  }

  return item instanceof Promise;
}
