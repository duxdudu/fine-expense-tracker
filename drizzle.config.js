/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.jsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://Expenses-tracker_owner:vQgW0Dwq1zCU@ep-tiny-block-a5obk1b4-pooler.us-east-2.aws.neon.tech/Expenses-tracker?sslmode=require"
  },
};
