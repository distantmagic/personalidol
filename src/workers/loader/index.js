/**
 * Code originally from https://github.com/developit/workerize-loader
 *
 * It's a 'workerize-loader', but stripped entirely (I hope) of magic and RPC
 * calls handling. It returns just a raw Worker instance.
 */

const loaderUtils = require("loader-utils");

const NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const WebWorkerTemplatePlugin = require("webpack/lib/webworker/WebWorkerTemplatePlugin");

function createChildCompiler(self, request, filename) {
  const childCompilerOptions = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null,
  };
  const childCompiler = self._compilation.createChildCompiler("worker", childCompilerOptions);

  new WebWorkerTemplatePlugin(childCompilerOptions).apply(childCompiler);

  if (self.target !== "webworker" && self.target !== "web") {
    new NodeTargetPlugin().apply(childCompiler);
  }

  new SingleEntryPlugin(self.context, request, "main").apply(childCompiler);

  return childCompiler;
}

function getWorkerURL(options, compilation, file) {
  let workerURL;

  if (options.external) {
    workerURL = `__webpack_public_path__ + ${JSON.stringify(file)}`;
  } else {
    let contents = compilation.assets[file].source();

    workerURL = `URL.createObjectURL(new Blob([${JSON.stringify(contents)}]))`;
  }

  if (options.import) {
    return `"data:,importScripts('"+location.origin+${workerURL}+"')"`;
  }

  return workerURL;
}

function pitch(request) {
  const options = loaderUtils.getOptions(this) || {};
  const compilerOptions = this._compiler.options || {};
  const cb = this.async();
  const filename = loaderUtils.interpolateName(this, `${options.name || "[hash]"}.worker.js`, {
    context: options.context || this.rootContext || this.options.context,
    regExp: options.regExp,
  });

  if (compilerOptions.output && compilerOptions.output.globalObject === "window") {
    console.warn('Warning (workerize-loader): output.globalObject is set to "window". It should be set to "self" or "this" to support HMR in Workers.');
  }

  createChildCompiler(this, request, filename).runAsChild((err, entries, compilation) => {
    if (err) {
      return cb(err)
    }

    const entry = entries[0];

    if (!entry) {
      return cb(null, null);
    }

    return cb(
      null,
      `
      module.exports = function() {
        return new Worker(${getWorkerURL(options, compilation, entry.files[0])}, {
          name: ${JSON.stringify(filename)}
        });
      }
    `
    );
  });
};

module.exports = {
  pitch: pitch,
};
