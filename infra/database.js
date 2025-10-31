import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === "development" ? false : true,
});

async function query(queryObject) {
  const client = await pool.connect();

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error", error);
    throw error;
  } finally {
    client.release();
  }

  // const result = await pool.query(queryObject);
  // await pool.end();
  // return result;
}

export default {
  query: query,
};
