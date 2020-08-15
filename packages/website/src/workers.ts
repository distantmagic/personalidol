type Workers = {
  [key: string]: {
    name: string;
    url: string;
  };
};

export const workers: Workers = {
  atlas: {
    name: "Texture atlas maker",
    url: "/lib/worker_atlas.js",
  },
  md2: {
    name: "MD2 model loader",
    url: "/lib/worker_md2.js",
  },
  offscreen: {
    name: "Offscreen Canvas",
    url: "/lib/worker_offscreen.js",
  },
  progress: {
    name: "Progress monitor",
    url: "/lib/worker_progress.js",
  },
  quakemaps: {
    name: "Map loader",
    url: "/lib/worker_quakemaps.js",
  },
  textures: {
    name: "Texture loader",
    url: "/lib/worker_textures.js",
  },
};
