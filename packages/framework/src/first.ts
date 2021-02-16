export function first<T>(items: Set<T>): null | T {
  for (let _item of items) {
    return _item;
  }

  return null;
}
