import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const csvPath = path.join(process.cwd(), "data", "projects.csv");
const jsonPath = path.join(process.cwd(), "data", "projects.json");

const csv = fs.readFileSync(csvPath, "utf8");

const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2));
console.log(`✅ Wrote ${records.length} projects to data/projects.json`);
