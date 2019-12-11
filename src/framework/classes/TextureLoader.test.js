// @flow

import * as THREE from "three";

import ExceptionHandler from "./ExceptionHandler";
import ExceptionHandlerFilter from "./ExceptionHandlerFilter";
import Logger from "./Logger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TextureLoader from "./TextureLoader";
import { default as TextureLoaderException } from "./Exception/TextureLoader";

test("indexes textures and keeps consistent id registry", function() {
  const exceptionHandler = new ExceptionHandler(new Logger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const textureLoader = new TextureLoader(loggerBreadcrumbs, new THREE.LoadingManager(), queryBus);

  textureLoader.registerTexture("a", "a.png");
  textureLoader.registerTexture("b", "b.png");
  textureLoader.registerTexture("c", "c.png");

  expect(textureLoader.getTextureSource("a")).toBe("a.png");
  expect(textureLoader.getTextureSource("b")).toBe("b.png");
  expect(textureLoader.getTextureSource("c")).toBe("c.png");
});

test("fails when texture definitions are inconsistent", function() {
  const exceptionHandler = new ExceptionHandler(new Logger(), new ExceptionHandlerFilter());
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs);
  const textureLoader = new TextureLoader(loggerBreadcrumbs, new THREE.LoadingManager(), queryBus);

  textureLoader.registerTexture("a", "a.png");
  textureLoader.registerTexture("a", "a.png");

  expect(function() {
    textureLoader.registerTexture("a", "b.png");
  }).toThrow(TextureLoaderException);
});
