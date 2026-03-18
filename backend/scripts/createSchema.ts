import dotenv from "dotenv"
import { Client } from "pg"

dotenv.config()

async function createSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()

    await client.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        iso_code TEXT
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS language_distributions (
        id SERIAL PRIMARY KEY,
        language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
        country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
        speakers BIGINT NOT NULL,
        UNIQUE (language_id, country_id)
      );
    `)

    console.log("✅ Schema created successfully")
  } catch (error) {
    console.error("❌ Failed to create schema")
    console.error(error)
  } finally {
    await client.end()
  }
}

createSchema()