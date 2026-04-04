const fs = require("fs");
const path = require("path");

const reactRoot = path.resolve(__dirname, "..");
const sourcePath = path.resolve(
  reactRoot,
  "../../statsig-sidecar/sidecar-js-v2/dist/index.js",
);
const outputPath = path.resolve(reactRoot, "public/sidecar-v2-local.js");

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing sidecar build: ${sourcePath}`);
  console.error(
    "Build sidecar first: cd statsig-sidecar/sidecar-js-v2 && npm run build",
  );
  process.exit(1);
}

fs.copyFileSync(sourcePath, outputPath);
console.log(`Synced local sidecar bundle -> ${outputPath}`);
