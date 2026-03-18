import dotenv from "dotenv"
import { Client } from "pg"

dotenv.config()

async function testDbConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log("✅ Connected to Postgres successfully")

    const result = await client.query("SELECT current_database()")
    console.log("Connected database:", result.rows[0].current_database)
  } catch (error) {
    console.error("❌ Failed to connect to Postgres")
    console.error(error)
  } finally {
    await client.end()
  }
}

testDbConnection()