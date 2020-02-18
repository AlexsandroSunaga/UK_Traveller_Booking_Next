import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const target = join(process.cwd(), ".next");

if (!existsSync(target)) {
  process.exit(0);
}

for (let attempt = 0; attempt < 5; attempt += 1) {
  try {
    rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    process.exit(0);
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
}

console.error("Could not remove .next — stop any running dev servers and try again.");
process.exit(1);
