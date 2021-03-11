import type { ProgressCallback } from "./ProgressCallback.type";

type ResponseWrapper = (value: Response) => Response | Promise<Response>;

export function fetchProgress(progressCallback: ProgressCallback): ResponseWrapper {
  return function (response: Response): Response | Promise<Response> {
    const contentLength = Number(response.headers.get("content-length"));
    const body = response.body;

    if (!body || contentLength < 1) {
      return response;
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
                resolve(
                  new Response(stream, {
                    headers: response.headers,
                    status: response.status,
                  })
                );
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
