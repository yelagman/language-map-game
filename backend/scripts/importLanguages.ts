import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { Client } from "pg"

dotenv.config()

type CountryDistribution = {
  country: string
  speakers: number
}

type LanguageEntry = {
  language: string
  countries: CountryDistribution[]
}

async function importLanguages() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()

    const dataPath = path.join(__dirname, "../../data/languages.json")
    const rawData = fs.readFileSync(dataPath, "utf-8")
    const languages: LanguageEntry[] = JSON.parse(rawData)

    for (const languageEntry of languages) {
      const languageResult = await client.query(
        `
        INSERT INTO languages (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
        `,
        [languageEntry.language]
      )

      const languageId = languageResult.rows[0].id

      for (const countryEntry of languageEntry.countries) {
        const countryResult = await client.query(
          `
          INSERT INTO countries (name)
          VALUES ($1)
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id;
          `,
          [countryEntry.country]
        )

        const countryId = countryResult.rows[0].id

        await client.query(
          `
          INSERT INTO language_distributions (language_id, country_id, speakers)
          VALUES ($1, $2, $3)
          ON CONFLICT (language_id, country_id)
          DO UPDATE SET speakers = EXCLUDED.speakers;
          `,
          [languageId, countryId, countryEntry.speakers]
        )
      }
    }

    console.log("✅ Language data imported successfully")
  } catch (error) {
    console.error("❌ Failed to import language data")
    console.error(error)
  } finally {
    await client.end()
  }
}

importLanguages()