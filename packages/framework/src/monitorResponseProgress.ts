import type { ProgressCallback } from "./ProgressCallback.type";

export function monitorResponseProgress(
  progressCallback: ProgressCallback,
  needsResponse: true
): (value: Response) => Promise<Response>;
export function monitorResponseProgress(
  progressCallback: ProgressCallback,
  needsResponse: false
): (value: Response) => Promise<null>;

export function monitorResponseProgress(
  progressCallback: ProgressCallback,
  needsResponse: boolean
): (value: Response) => Promise<Response | null> {
  return function (response: Response): Promise<Response | null> {
    const contentLength = Number(response.headers.get("content-length"));
    const body = response.body;

    if (!body || contentLength < 1) {
      if (needsResponse) {
        return Promise.resolve(response);
      }

      return Promise.resolve(null);
    }

    return new Promise(function (resolve, reject) {
      const reader = body.getReader();

      let _downloadedChunksLength: number = 0;

      const stream = new ReadableStream({
        start(controller: ReadableStreamDefaultController) {
          function push() {
            reader.read().then(function ({ done, value }) {
              if (value) {
                _downloadedChunksLength += value.length;
                progressCallback(_downloadedChunksLength, contentLength);
              }
              if (done) {
                controller.close();

                if (needsResponse) {
                  // It is necessary to create a new response since the current
                  // ReadableStream is drained and cannot be read from again.
                  resolve(
                    new Response(stream, {
                      headers: response.headers,
                      status: response.status,
                    })
                  );
                } else {
                  // This conserves a bit of memory when the response can be
                  // discarded after reading.
                  resolve(null);
                }
              } else {
                controller.enqueue(value);
                push();
              }
            });
          }

          push();
        },
      });
    });
  };
}
