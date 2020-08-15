import { _getSetCache } from "./_getSetCache";

import type { SupportCache } from "./SupportCache.type";

export const CACHE_KEY = Symbol("createImageBitmap");

/**
 * Check if the js enviroment is capable of decoding one pixel GIF and use
 * `createImageBitmap` with additional options.
 */
async function _check(): Promise<boolean> {
  if ("function" !== typeof globalThis.createImageBitmap) {
    return false;
  }

  //prettier-ignore
  const pixel = [
    71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33,
    249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1, 68, 0, 59,
  ];

  const blob = new Blob([Uint8Array.from(pixel)], {
    type: "image/gif",
  });
  const options: {
    imageOrientation: "flipY";
  } = {
    imageOrientation: "flipY",
  };

  // prettier-ignore
  return createImageBitmap(blob, options)
    .then(_onImageBitmapSupported)
    .catch(_onImageBitmapError)
  ;
}

function _onImageBitmapSupported(): true {
  return true;
}

function _onImageBitmapError(err: Error): boolean {
  // Firefox ("createImageBitmap fails when providing options object")
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1335594
  if (err.message.includes("2 is not a valid argument count for any overload")) {
    return false;
  }

  // Something we were not prepared for. It's better to throw and fix the
  // issue.
  throw err;
}

export function isCreateImageBitmapSupported(supportCache: SupportCache): Promise<boolean> {
  return _getSetCache(supportCache, CACHE_KEY, _check);
}
