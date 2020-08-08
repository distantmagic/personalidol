type Workers = {
  [key: string]: {
    name: string;
    url: string;
  };
};

export const workers: Workers = {
  offscreen: {
    name: "Offscreen Canvas",
    url: "/lib/worker_offscreen.js",
  },
  md2: {
    name: "MD2 Model Loader",
    url: "/lib/worker_md2.js",
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
