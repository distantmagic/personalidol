export function canvas2DDrawImage(
  canvas: HTMLCanvasElement,
  context2D: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  canvas.height = image.naturalHeight;
  canvas.width = image.naturalWidth;

  // It's worth to note here that JS is asynchronous, but while we are in the
  // same thread, there is no risk of several images being written to the
  // canvas at the same time, so no locks are necessary.

  context2D.drawImage(image, 0, 0);
}
