import { Config } from "drizzle-kit";

import * as dotenv from "dotenv";

dotenv.config({
 path: ".env.local",
});

if (!process.env.DATABASE_URL) {
 throw new Error("DATABASE_URL is not defined.");
}

export default {
 schema: "./src/db/schema/*",
 driver: "pg",
 dbCredentials: {
  connectionString: process.env.DATABASE_URL!,
 },
 out: "./drizzle",
} satisfies Config;
