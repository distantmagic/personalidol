import { createLoadingComment } from "./createLoadingComment";

import type { LoadingManagerItem } from "./LoadingManagerItem.type";

test("no resources mean empty comment", function () {
  const itemsLoaded: Set<LoadingManagerItem> = new Set();
  const itemsToLoad: Set<LoadingManagerItem> = new Set();

  expect(createLoadingComment(itemsLoaded, itemsToLoad)).toBe("");
});

test("comment is created from a list of resources", function () {
  const itemsLoaded: Set<LoadingManagerItem> = new Set();
  const itemsToLoad: Set<LoadingManagerItem> = new Set();

  itemsToLoad.add({
    id: "0",
    resourceType: "texture",
    resourceUri: "foo.png",
    weight: 1,
  });

  expect(createLoadingComment(itemsLoaded, itemsToLoad)).toBe("texture foo.png");
});

test("similar resources are grouped", function () {
  const itemsLoaded: Set<LoadingManagerItem> = new Set();
  const itemsToLoad: Set<LoadingManagerItem> = new Set();

  itemsToLoad.add({
    id: "0",
    resourceType: "texture",
    resourceUri: "foo.png",
    weight: 1,
  });

  itemsToLoad.add({
    id: "1",
    resourceType: "texture",
    resourceUri: "bar.png",
    weight: 1,
  });

  expect(createLoadingComment(itemsLoaded, itemsToLoad)).toBe("2 textures");
});

test("if more than two resource types are loading they are never grouped", function () {
  const itemsLoaded: Set<LoadingManagerItem> = new Set();
  const itemsToLoad: Set<LoadingManagerItem> = new Set();

  itemsToLoad.add({
    id: "0",
    resourceType: "texture",
    resourceUri: "foo.png",
    weight: 1,
  });

  itemsToLoad.add({
    id: "1",
    resourceType: "font",
    resourceUri: "bar.ttf",
    weight: 1,
  });

  itemsToLoad.add({
    id: "2",
    resourceType: "image",
    resourceUri: "baz.png",
    weight: 1,
  });

  itemsToLoad.add({
    id: "3",
    resourceType: "image",
    resourceUri: "booz.png",
    weight: 1,
  });

  expect(createLoadingComment(itemsLoaded, itemsToLoad)).toBe("font, 2 images, texture");
});

test("resources from different types are not grouped", function () {
  const itemsLoaded: Set<LoadingManagerItem> = new Set();
  const itemsToLoad: Set<LoadingManagerItem> = new Set();

  itemsToLoad.add({
    id: "0",
    resourceType: "texture",
    resourceUri: "foo.png",
    weight: 1,
  });

  itemsToLoad.add({
    id: "1",
    resourceType: "texture",
    resourceUri: "bar.png",
    weight: 1,
  });

  itemsToLoad.add({
    id: "1",
    resourceType: "font",
    resourceUri: "Foo",
    weight: 1,
  });

  expect(createLoadingComment(itemsLoaded, itemsToLoad)).toBe("font Foo, 2 textures");
});
