import type { ProgressCallback } from "./ProgressCallback.type";

type ResponseWrapper = (value: Response) => Response | Promise<Response>;

export function fetchProgress(progressCallback: ProgressCallback): ResponseWrapper {
  return function (response: Response): Response {
    const contentLength = Number(response.headers.get("content-length"));
    const body = response.body;

    if (!body || contentLength < 1) {
      return response;
    }

    const reader = body.getReader();

    let _downloadedChunksLength: number = 0;

    const stream = new ReadableStream({
      start(controller: ReadableStreamDefaultController) {
        function push() {
          reader.read().then(function ({ done, value }) {
            if (done) {
              controller.close();
              return;
            }
            if (value) {
              _downloadedChunksLength += value.length;
              progressCallback(_downloadedChunksLength, contentLength);
            }
            controller.enqueue(value);
            push();
          });
        }

        push();
      },
    });

    return new Response(stream, {
      headers: response.headers,
      status: response.status,
    });
  };
}
