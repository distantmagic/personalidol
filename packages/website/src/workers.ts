type Workers = {
  [key: string]: {
    name: string;
    url: string;
  };
};

export const workers: Workers = {
  atlas: {
    name: "Texture Atlas Maker",
    url: "/lib/worker_atlas.js",
  },
  md2: {
    name: "MD2 Model Loader",
    url: "/lib/worker_md2.js",
  },
  offscreen: {
    name: "Offscreen Canvas",
    url: "/lib/worker_offscreen.js",
  },
  quakemaps: {
    name: "Map Loader",
    url: "/lib/worker_quakemaps.js",
  },
  textures: {
    name: "Texture Loader",
    url: "/lib/worker_textures.js",
  },
};
