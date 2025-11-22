#!/usr/bin/env -S npx tsx

import { writeFile } from "node:fs/promises";
import { createApp } from "../src/app.js";
import { resolve } from "node:path";

const [, , output] = process.argv;
if (!output) {
	throw new Error("Output path not specified");
}

const filepath = resolve(process.cwd(), output);

const app = await createApp();
await app.ready();

if (!app.swagger) {
	throw new Error("@fastify/swagger plugin is not loaded");
}

const doc = JSON.stringify(app.swagger());
await writeFile(filepath, doc, { flag: "w+" });
console.log(`OpenAPI document saved to ${filepath}`);

await app.close();
