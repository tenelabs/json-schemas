import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDirectory = path.resolve(__dirname, "..");
const schemaPath = path.join(rootDirectory, "data/schemas.json");
const templatePath = path.join(rootDirectory, "./templates/html-template.html");
const outputPath = path.join(rootDirectory, "index.html");

const schemas = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");

const grouped = schemas.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

let cardHTML = "";
for (const [category, items] of Object.entries(grouped)) {
  cardHTML += `<h1>${category}</h1>\n<div class="grid" data-category="${category}">\n`;
  for (const { name, cdn } of items) {
    cardHTML += `  <a class="card" href="${cdn}" target="_blank" rel="noopener noreferrer">${name}</a>\n`;
  }
  cardHTML += `</div>\n`;
}

const finalHTML = template.replace("<!-- cards-here -->", cardHTML);

fs.writeFileSync(outputPath, finalHTML);
console.log(`Generated HTML at ${outputPath}`);
