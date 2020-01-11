type CacheMap = WeakMap<Function, [readonly any[], any]>;
type MemoizeBuilder<T, U extends readonly any[]> = (...args: U) => null | T;

let memoizeCacheInstance: null | CacheMap = null;

function getMemoizeCache(): CacheMap {
  if (!memoizeCacheInstance) {
    memoizeCacheInstance = new WeakMap<Function, [ReadonlyArray<any>, any]>();
  }

  return memoizeCacheInstance;
}

function rebuildCache<T, U extends readonly any[]>(builder: MemoizeBuilder<T, U>, params: U): null | T {
  const built = builder(...params);

  getMemoizeCache().set(builder, [params, built]);

  return built;
}

export default function memoize<T, U extends readonly any[]>(builder: MemoizeBuilder<T, U>, params: U): null | T {
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
