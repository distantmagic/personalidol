// @flow

import CancelToken from "./CancelToken";
import JSONRPCClient from "./JSONRPCClient";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import { default as JSONRPCGeneratorChunkResponse } from "./JSONRPCResponse/GeneratorChunk";
import { default as JSONRPCPromiseResponse } from "./JSONRPCResponse/Promise";

test("processes incoming generator chunk response", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const postMessageMock = jest.fn();
  const jsonRpcClient = new JSONRPCClient(loggerBreadcrumbs, postMessageMock, function() {
    return "1";
  });
  const promise = (async function() {
    const cancelToken = new CancelToken(loggerBreadcrumbs);
    const responseChunks = [];

    for await (let responseChunk of jsonRpcClient.requestGenerator(cancelToken, "test-promise", [])) {
      responseChunks.push(responseChunk);
    }

    expect(responseChunks).toEqual([0, 1, 2, 3]);
  })();

  const chunks = [
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "1", "2", "test-generator", "generator", 0),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "3", "4", "test-generator", "generator", 2),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "2", "3", "test-generator", "generator", 1),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "4", null, "test-generator", "generator", 3),
  ];

  for (let chunk of chunks) {
    await jsonRpcClient.handleSerializedResponse(chunk.serialize());
  }

  await promise;

  expect(postMessageMock.mock.calls).toHaveLength(1);
}, 100);

test("processes incoming promise response", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const postMessageMock = jest.fn();
  const jsonRpcClient = new JSONRPCClient(loggerBreadcrumbs, postMessageMock, function() {
    return "1";
  });
  const response = new JSONRPCPromiseResponse<number>(loggerBreadcrumbs, "1", "test-promise", "promise", 4);

  const promise = (async function() {
    const cancelToken = new CancelToken(loggerBreadcrumbs);
    const serverResponse = await jsonRpcClient.requestPromise(cancelToken, "test-promise", []);

    expect(serverResponse).toBe(4);
  })();

  await jsonRpcClient.handleSerializedResponse(response.serialize());
  await promise;

  expect(postMessageMock.mock.calls).toHaveLength(1);

  const sent = JSONRPCPromiseResponse.unserialize(loggerBreadcrumbs, postMessageMock.mock.calls[0][0]);

  expect(sent.getId()).toBe(response.getId());
  expect(sent.getMethod()).toBe(response.getMethod());
  expect(sent.getType()).toBe(response.getType());
}, 100);
