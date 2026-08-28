import { copyFile, access } from "node:fs/promises";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function copyIfMissing(target) {
  if (await exists(target)) {
    console.log(`${target} already exists`);
    return;
  }

  await copyFile(".env.local.example", target);
  console.log(`Created ${target}`);
}

await copyIfMissing(".env.local");
await copyIfMissing(".env");

console.log("");
console.log("Next steps:");
console.log("1. Edit .env.local and .env if you want to add OPENAI_API_KEY.");
console.log("2. Run: npm run dev:docker");
