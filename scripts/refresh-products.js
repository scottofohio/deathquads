require("../load-env")
const printfulConfig = require("../printful.config")
const printful = require("../lib/printful")

async function main() {
  const apiKey = process.env.PRINTFUL_API_KEY
  if (!apiKey) {
    console.error(
      "PRINTFUL_API_KEY is not set — add it to .env.development / .env.production first."
    )
    process.exit(1)
  }

  const products = await printful.fetchProducts({ apiKey, config: printfulConfig })
  printful.writeSnapshot(products)
  console.log(
    `Wrote ${products.length} product(s) to ${printful.SNAPSHOT_PATH}. Commit this file so production builds don't need the Printful key.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
