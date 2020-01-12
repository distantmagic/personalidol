import * as THREE from "three";

import ExceptionHandler from "src/framework/classes/ExceptionHandler";
import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeMapTextureLoader from "src/framework/classes/QuakeMapTextureLoader";
import QueryBus from "src/framework/classes/QueryBus";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";
import { default as SilentLogger } from "src/framework/classes/Logger/Silent";

test("indexes textures and keeps consistent id registry", function() {
  const exceptionHandler = new ExceptionHandler(new SilentLogger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs, new THREE.LoadingManager(), queryBus);

  textureLoader.registerTexture("a", "a.png");
  textureLoader.registerTexture("b", "b.png");
  textureLoader.registerTexture("c", "c.png");

  expect(textureLoader.getTextureSource("a")).toBe("a.png");
  expect(textureLoader.getTextureIndex("a")).toBe(0);

  expect(textureLoader.getTextureSource("b")).toBe("b.png");
  expect(textureLoader.getTextureIndex("b")).toBe(1);

  expect(textureLoader.getTextureSource("c")).toBe("c.png");
  expect(textureLoader.getTextureIndex("c")).toBe(2);
});

test("fails when texture definitions are inconsistent", function() {
  const exceptionHandler = new ExceptionHandler(new SilentLogger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs, new THREE.LoadingManager(), queryBus);

  textureLoader.registerTexture("a", "a.png");
  textureLoader.registerTexture("a", "a.png");

  expect(textureLoader.getTextureIndex("a")).toBe(0);

  expect(function() {
    textureLoader.registerTexture("a", "b.png");
  }).toThrow(QuakeMapException);
});

test("fails when texture does not exist", function() {
  const exceptionHandler = new ExceptionHandler(new SilentLogger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const textureLoader = new QuakeMapTextureLoader(loggerBreadcrumbs, new THREE.LoadingManager(), queryBus);

  expect(function() {
    textureLoader.getTextureIndex("a");
  }).toThrow(QuakeMapException);
});
