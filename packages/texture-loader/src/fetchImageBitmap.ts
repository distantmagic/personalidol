import { _createImageBitmap } from "./_createImageBitmap";

function responseToBlob(response: Response): Promise<Blob> {
  return response.blob();
}

export function fetchImageBitmap(url: string): Promise<ImageBitmap> {
  return fetch(url).then(responseToBlob).then(_createImageBitmap);
}
