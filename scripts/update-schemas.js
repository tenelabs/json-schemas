import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDirectory = path.resolve(__dirname, "..");
const CDN_BASE = "https://unpkg.com/@tenedev/json-schemas@latest/";

function collectSchemas(dir) {
  const results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== "node_modules") {
      results.push(...collectSchemas(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".schema.json")) {
      const relativePath = path
        .relative(rootDirectory, fullPath)
        .replace(/\\/g, "/");

      const category = path.basename(path.dirname(fullPath));
      const name = path.basename(fullPath, ".schema.json");

      results.push({
        category,
        name,
        cdn: `${CDN_BASE}${relativePath}`,
      });
    }
  }

  return results;
}

const schemas = collectSchemas(rootDirectory);

const dataDir = path.join(rootDirectory, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const outputPath = path.join(dataDir, "schemas.json");
fs.writeFileSync(outputPath, JSON.stringify(schemas, null, 2));

console.log(`Exported ${schemas.length} schema entries to ${outputPath}`);
