// @flow

import TiledRelativeFilename from "./TiledRelativeFilename";

it("resolves tileset filename with relative paths", function() {
  const filename = new TiledRelativeFilename("/assets/map.tmx", "tileset.tsx");

  expect(filename.asString()).toBe("/assets/tileset.tsx");
});

it("resolves tileset filename with absolute paths", function() {
  const filename = new TiledRelativeFilename("/assets/map.tmx", "/assets/tileset.tsx");

  expect(filename.asString()).toBe("/assets/tileset.tsx");
});

it("is equatable", function() {
  const filename1 = new TiledRelativeFilename("/assets/map.tmx", "/assets/tileset.tsx");
  const filename2 = new TiledRelativeFilename("/assets/map.tmx", "tileset.tsx");

  expect(filename1.isEqual(filename2)).toBe(true);
});
