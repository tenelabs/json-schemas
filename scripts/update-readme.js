import fs from "fs";
import path from "path";

function updateReadme() {
  const rootDir = process.cwd();
  const readmeFile = path.join(rootDir, "README.md");

  const schemasPath = path.join(rootDir, "data", "schemas.json");
  const schemas = JSON.parse(fs.readFileSync(schemasPath, "utf8"));

  const groupedSchemas = schemas.reduce((acc, { name, cdn, category }) => {
    if (!acc[category]) acc[category] = [];
    acc[category].push({ name, cdn });
    return acc;
  }, {});

  let readmeContent = `# [JSON Schemas [${schemas.length}]](https://www.npmjs.com/package/@tenedev/json-schemas)\n
This repository contains a collection of JSON schemas for various purposes.\n\n`;

  for (const [category, items] of Object.entries(groupedSchemas)) {
    readmeContent += `## ${category} [${items.length}]\n`;
    items.forEach(({ name, cdn }) => {
      const displayName = name
        .split("")
        .map((char, index) => (index === 0 ? char.toUpperCase() : char))
        .join("");
      readmeContent += `- [${displayName}](${cdn})\n`;
    });
    readmeContent += "\n";
  }

  fs.writeFileSync(readmeFile, readmeContent, "utf8");
  console.log("README.md has been updated!");
}

updateReadme();
