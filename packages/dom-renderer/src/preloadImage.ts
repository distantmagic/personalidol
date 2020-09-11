export function preloadImage(textureUrl: string): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject) {
    const image = new Image();

    image.crossOrigin = "Anonymous";
    image.onerror = reject;
    image.onload = function () {
      resolve(image);
    };

    image.src = textureUrl;
  });
}
