import fs from "fs"
import path from "path"

const dataPath = path.join(__dirname, "../../data/languages.json")

const rawData = fs.readFileSync(dataPath, "utf-8")

const languages = JSON.parse(rawData)

console.log("Loaded languages:\n")

languages.forEach((lang: any) => {
  console.log(`Language: ${lang.language}`)
  lang.countries.forEach((c: any) => {
    console.log(`  - ${c.country}: ${c.speakers.toLocaleString()} speakers`)
  })
  console.log("")
})