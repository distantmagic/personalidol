const _options: {
  imageOrientation: "flipY";
} = {
  imageOrientation: "flipY",
};
let _optionsSupported: undefined | boolean = void 0;

export function _createImageBitmap(blob: Blob): Promise<ImageBitmap> {
  if (true === _optionsSupported) {
    return createImageBitmap(blob, _options);
  }

  if (false === _optionsSupported) {
    return createImageBitmap(blob);
  }

  return createImageBitmap(blob, _options).catch(function (err) {
    // Firefox
    if (err.message.includes("2 is not a valid argument count for any overload.")) {
      _optionsSupported = false;
      return _createImageBitmap(blob);
    }

    throw err;
  });
}
