import fs from "fs"
import path from "path"
import promptSync from "prompt-sync"

function playGame() {
  const prompt = promptSync()

  const dataPath = path.join(__dirname, "../../data/languages.json")

  const rawData = fs.readFileSync(dataPath, "utf-8")
  const languages = JSON.parse(rawData)

  // pick random language
  const randomIndex = Math.floor(Math.random() * languages.length)
  const language = languages[randomIndex]

  // sort countries by speakers
  const sortedCountries = [...language.countries].sort(
    (a, b) => a.speakers - b.speakers
  )

  console.log("\n🌍 Language Map Puzzle\n")

  for (let i = 0; i < sortedCountries.length; i++) {
    const country = sortedCountries[i]

    console.log(
      `Reveal ${i + 1}: ${country.country} (${country.speakers.toLocaleString()} speakers)`
    )

    const guess = prompt("\nYour guess: ").trim()

    if (guess.toLowerCase() === language.language.toLowerCase()) {
      console.log("\n✅ Correct!")
      return
    } else {
      console.log("❌ Wrong guess\n")
    }
  }

  console.log(`\n💀 Game over! The answer was: ${language.language}`)
}

playGame()