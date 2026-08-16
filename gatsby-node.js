require("./load-env")
const path = require("path")
const printfulConfig = require("./printful.config")
const printful = require("./lib/printful")

exports.sourceNodes = async ({ actions, createContentDigest, reporter }) => {
  const { createNode } = actions
  const apiKey = process.env.PRINTFUL_API_KEY

  let products
  if (apiKey) {
    reporter.info("Printful: fetching products from API")
    products = await printful.fetchProducts({ apiKey, config: printfulConfig })
    printful.writeSnapshot(products)
    reporter.info(
      `Printful: fetched ${products.length} product(s), cached to ${printful.SNAPSHOT_PATH}`
    )
  } else {
    products = printful.readSnapshot()
    if (!products) {
      throw new Error(
        "No PRINTFUL_API_KEY set and no cached product data found. " +
          "Run `npm run refresh-products` locally with the key first, then commit " +
          "src/data/printful-products.json."
      )
    }
    reporter.info(
      `Printful: using ${products.length} cached product(s) from ${printful.SNAPSHOT_PATH}`
    )
  }

  for (const node of products) {
    createNode({
      ...node,
      id: `printful-product-${node.printfulId}`,
      parent: null,
      children: [],
      internal: {
        type: "PrintfulProduct",
        contentDigest: createContentDigest(node),
      },
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allPrintfulProduct {
        nodes {
          category
        }
      }
    }
  `)

  if (result.errors) throw new Error(result.errors.join(", "))

  const usedCategories = new Set(
    result.data.allPrintfulProduct.nodes
      .map((n) => n.category)
      .filter(Boolean)
  )

  for (const category of printfulConfig.categories) {
    if (!usedCategories.has(category.slug)) {
      console.log(`Printful: category "${category.slug}" has no products — skipping page`)
      continue
    }
    createPage({
      path: `/${category.slug}`,
      component: path.resolve("./src/templates/category.jsx"),
      context: { slug: category.slug, label: category.label },
    })
  }
}
