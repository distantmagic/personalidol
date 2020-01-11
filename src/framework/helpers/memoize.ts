// @flow strict

type CacheMap = WeakMap<Function, [$ReadOnlyArray<any>, any]>;
type MemoizeBuilder<T, U: $ReadOnlyArray<any>> = (...U) => ?T;

let memoizeCacheInstance: ?CacheMap = null;

function getMemoizeCache(): CacheMap {
  if (!memoizeCacheInstance) {
    memoizeCacheInstance = new WeakMap<Function, [$ReadOnlyArray<any>, any]>();
  }

  return memoizeCacheInstance;
}

function rebuildCache<T, U: $ReadOnlyArray<any>>(builder: MemoizeBuilder<T, U>, params: U): ?T {
  const built = builder(...params);

  getMemoizeCache().set(builder, [params, built]);

  return built;
}

export default function memoize<T, U: $ReadOnlyArray<any>>(builder: MemoizeBuilder<T, U>, params: U): ?T {
  const memoizedCache = getMemoizeCache();
  const cached = memoizedCache.get(builder);

  if (!cached || cached[0].length !== params.length) {
    return rebuildCache(builder, params);
  }

  for (let i = 0; i < cached[0].length; i += 1) {
    if (cached[0][i] !== params[i]) {
      return rebuildCache<T, U>(builder, params);
    }
  }

  return cached[1];
}
