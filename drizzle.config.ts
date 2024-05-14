import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";

dotenv.config({
 path: ".env.local",
});

if (!process.env.DATABASE_URL) {
 throw new Error("DATABASE_URL is not defined.");
}

export default defineConfig({
 dialect: "postgresql",
 dbCredentials: {
  url: process.env.DATABASE_URL!,
 },
 schema: "./src/db/schema/index.ts",
 out: "./src/db/migrations",
 verbose: true,
 strict: true,
});
