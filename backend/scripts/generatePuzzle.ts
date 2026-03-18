import fs from "fs"
import path from "path"

const dataPath = path.join(__dirname, "../../data/languages.json")

const rawData = fs.readFileSync(dataPath, "utf-8")
const languages = JSON.parse(rawData)

// pick a random language
const randomIndex = Math.floor(Math.random() * languages.length)
const language = languages[randomIndex]

// sort countries by speakers (ascending)
const sortedCountries = [...language.countries].sort(
  (a, b) => a.speakers - b.speakers
)

console.log("Today's puzzle:\n")

sortedCountries.forEach((country: any, i: number) => {
  console.log(
    `Reveal ${i + 1}: ${country.country} (${country.speakers.toLocaleString()} speakers)`
  )
})

console.log("\nGuess the language!")