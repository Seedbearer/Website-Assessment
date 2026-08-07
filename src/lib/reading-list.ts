import "server-only";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "content", "reading-list.csv");

export type Book = {
  category: string;
  title: string;
  author: string;
  relevance: string;
  affiliateLink?: string;
};

export type ReadingCategory = { name: string; books: Book[] };

// Parses one CSV record's worth of fields, honoring RFC4180 quoting (quoted fields can contain
// commas and embedded newlines; "" inside a quoted field is an escaped literal quote).
function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (inQuotes) {
      if (char === '"' && raw[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && raw[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }

  return rows;
}

// The book list is authored and maintained outside the repo (a spreadsheet the coach edits
// directly) and copied in as content/reading-list.csv when it's updated — expected roughly
// monthly. Swapping that file and redeploying is the entire update process, no code changes.
export function getReadingList(): ReadingCategory[] {
  if (!fs.existsSync(CSV_PATH)) return [];

  // This file is expected to be clean UTF-8. The version originally supplied was actually a
  // windows-1252 spreadsheet export (Excel's default "CSV", not "CSV UTF-8") — its em/en dashes
  // were raw windows-1252 bytes that utf-8 decoding turned into "�" — and had to be re-saved.
  // If a future monthly update garbles non-ASCII characters (dashes, smart quotes) the same way,
  // that's the same issue recurring: re-decode the new file as windows-1252 and re-save as utf-8
  // before committing it, rather than changing this to assume windows-1252 going forward, which
  // would just break correctly-encoded files instead.
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsv(raw);
  const [, ...dataRows] = rows; // drop header row

  const categories: ReadingCategory[] = [];
  for (const row of dataRows) {
    const [category, title, author, relevance, affiliateLink] = row.map((f) => f.trim());
    if (!category || !title) continue;

    let bucket = categories.find((c) => c.name === category);
    if (!bucket) {
      bucket = { name: category, books: [] };
      categories.push(bucket);
    }
    bucket.books.push({ category, title, author, relevance, affiliateLink: affiliateLink || undefined });
  }

  return categories;
}
