import * as schema from "@/db/schema";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql);
const db = drizzle(sql, { schema, logger: true });

export default db;
export * from "drizzle-orm";

