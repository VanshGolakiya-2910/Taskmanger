import fs from "fs";
import path from "path";
import pool from "./db.js";

export const runMigrations = async () => {
  try {
    const filePath = path.resolve(
      "src/migrations/init.schema.sql"
    );
    const schema = fs.readFileSync(filePath, "utf8");

    await pool.query(schema);
    console.log("Database schema initialized");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};
