import Fastify from "fastify"
import { pool } from "./db"

const fastify = Fastify({
  logger: true,
})

fastify.get("/health", async () => {
  return { status: "ok" }
})

fastify.get("/languages", async () => {
  const result = await pool.query(
    `
    SELECT id, name
    FROM languages
    ORDER BY name ASC
    `
  )

  return result.rows
})

fastify.get("/puzzle/random", async () => {
  const languageResult = await pool.query(
    `
    SELECT id, name
    FROM languages
    ORDER BY RANDOM()
    LIMIT 1
    `
  )

  const language = languageResult.rows[0]

  const distributionResult = await pool.query(
    `
    SELECT c.name AS country, ld.speakers
    FROM language_distributions ld
    JOIN countries c ON ld.country_id = c.id
    WHERE ld.language_id = $1
    ORDER BY ld.speakers ASC
    `,
    [language.id]
  )

  return {
    puzzleId: language.id,
    reveals: distributionResult.rows,
    }
})

async function start() {
  try {
    await fastify.listen({ port: 3000 })
    console.log("🚀 Server running at http://localhost:3000")
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()