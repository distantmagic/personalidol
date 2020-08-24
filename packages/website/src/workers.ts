type Workers = {
  [key: string]: {
    name: string;
    url: string;
  };
};

export const workers: Workers = {
  atlas: {
    name: "Loader(Atlas)",
    url: `${__STATIC_BASE_PATH}/lib/worker_atlas.js`,
  },
  md2: {
    name: "Loader(MD2)",
    url: `${__STATIC_BASE_PATH}/lib/worker_md2.js`,
  },
  offscreen: {
    name: "OffscreenCanvas",
    url: `${__STATIC_BASE_PATH}/lib/worker_offscreen.js`,
  },
  progress: {
    name: "ProgressMonitor",
    url: `${__STATIC_BASE_PATH}/lib/worker_progress.js`,
  },
  quakemaps: {
    name: "Loader(Map)",
    url: `${__STATIC_BASE_PATH}/lib/worker_quakemaps.js`,
  },
  textures: {
    name: "Loader(Texture)",
    url: `${__STATIC_BASE_PATH}/lib/worker_textures.js`,
  },
};
