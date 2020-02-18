import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const portArg = process.argv.find((arg) => arg.startsWith("--port="));
const port = portArg?.split("=")[1] ?? process.env.PORT ?? "3001";
const fresh = process.argv.includes("--fresh");
const nextDir = join(process.cwd(), ".next");

if (fresh && existsSync(nextDir)) {
  console.log("Cleaning .next cache...");
  try {
    rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    console.error("Could not remove .next — stop other dev servers first, then run npm run dev:fresh again.");
    process.exit(1);
  }
}

console.log(`Starting dev server on http://localhost:${port}`);
if (!fresh) {
  console.log("Tip: if you see ENOENT or 500 errors, stop the server and run: npm run dev:fresh");
}

const child = spawn(process.execPath, [join(process.cwd(), "node_modules/next/dist/bin/next"), "dev", "-p", port], {
  stdio: "inherit",
  env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--use-system-ca" },
});

child.on("exit", (code) => process.exit(code ?? 0));
