#!/usr/bin/env node
/**
 * Data validation script — run after any data change.
 * Usage: node scripts/validate-data.mjs
 * Exit code 0 = pass, 1 = fail
 *
 * NOTE: This is a thin wrapper that delegates to data/scripts/validate.mjs.
 * The enhanced validation script covers all checks from the original plus
 * additional rules (confidence numerics, SOT consistency, etc.).
 */
import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

try {
  execSync(`node ${join(ROOT, "data/scripts/validate.mjs")} --export`, {
    stdio: "inherit",
    cwd: ROOT,
  });
} catch {
  process.exit(1);
}
