// @flow

import TiledMapTilesetFilename from "./TiledMapTilesetFilename";

it("resolves tileset filename with relative paths", function() {
  const filename = new TiledMapTilesetFilename(
    "/assets/map.tmx",
    "tileset.tsx"
  );

  return expect(filename.asString()).toBe("/assets/tileset.tsx");
});

it("resolves tileset filename with absolute paths", function() {
  const filename = new TiledMapTilesetFilename(
    "/assets/map.tmx",
    "/assets/tileset.tsx"
  );

  return expect(filename.asString()).toBe("/assets/tileset.tsx");
});
