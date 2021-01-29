const Mustache = require("mustache");
const fs = require("fs").promises;
const path = require("path");

(async function () {
  const templatePath = path.join(__dirname, "..", "public", "index.mustache");
  const outputPath = path.join(__dirname, "..", "public", "index.html");
  const templateBuffer = await fs.readFile(templatePath);
  const template = templateBuffer.toString("utf-8");
  const rendered = Mustache.render(template, {
    __CACHE_BUST: Date.now(),
  });

  await fs.writeFile(outputPath, rendered, "utf-8");
}());
