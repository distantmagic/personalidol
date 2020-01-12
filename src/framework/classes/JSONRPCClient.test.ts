import CancelToken from "src/framework/classes/CancelToken";
import JSONRPCClient from "src/framework/classes/JSONRPCClient";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as JSONRPCGeneratorChunkResponse } from "src/framework/classes/JSONRPCResponse/GeneratorChunk";
import { default as JSONRPCPromiseResponse, unobjectify as unobjectifyJSONRPCPromiseResponse } from "src/framework/classes/JSONRPCResponse/Promise";

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
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "1", "2", "test-generator", "generator", new JSONRPCResponseData(0)),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "3", "4", "test-generator", "generator", new JSONRPCResponseData(2)),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "2", "3", "test-generator", "generator", new JSONRPCResponseData(1)),
    new JSONRPCGeneratorChunkResponse<number>(loggerBreadcrumbs, "1", "1", "4", null, "test-generator", "generator", new JSONRPCResponseData(3)),
  ];

  for (let chunk of chunks) {
    await jsonRpcClient.handleSerializedResponse(chunk.asObject());
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
  const data = new JSONRPCResponseData(4);
  const response = new JSONRPCPromiseResponse<number>(loggerBreadcrumbs, "1", "test-promise", "promise", data);

  const promise = (async function() {
    const cancelToken = new CancelToken(loggerBreadcrumbs);
    const serverResponse = await jsonRpcClient.requestPromise(cancelToken, "test-promise", []);

    expect(serverResponse).toBe(4);
  })();

  await jsonRpcClient.handleSerializedResponse(response.asObject());
  await promise;

  expect(postMessageMock.mock.calls).toHaveLength(1);

  const sent = unobjectifyJSONRPCPromiseResponse(loggerBreadcrumbs, postMessageMock.mock.calls[0][0]);

  expect(sent.getId()).toBe(response.getId());
  expect(sent.getMethod()).toBe(response.getMethod());
  expect(sent.getType()).toBe(response.getType());
}, 100);
