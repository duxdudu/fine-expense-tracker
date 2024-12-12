import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
    "postgresql://Expenses-tracker_owner:vQgW0Dwq1zCU@ep-tiny-block-a5obk1b4-pooler.us-east-2.aws.neon.tech/Expenses-tracker?sslmode=require",
);
export const db = drizzle(sql, { schema });
