const fs = require("fs")
const path = require("path")

const API_BASE = "https://api.printful.com"
const PAGE_LIMIT = 100
const SNAPSHOT_PATH = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "printful-products.json"
)

async function fetchJson(url, headers, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers })
    if (res.ok) return res.json()
    const retryable = res.status === 429 || res.status >= 500
    if (retryable && attempt < retries) {
      const delay = 1000 * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, delay))
      continue
    }
    const body = await res.text()
    throw new Error(`Printful API ${res.status} for ${url}: ${body.slice(0, 300)}`)
  }
}

function detectCategory(productName, variantProductNames, config) {
  if (config.overrides[productName]) return config.overrides[productName]
  const haystacks = [productName, ...variantProductNames]
  for (const category of config.categories) {
    for (const matcher of category.matchers) {
      if (haystacks.some((haystack) => matcher.test(haystack))) {
        return category.slug
      }
    }
  }
  return null
}

function categoryLabelFor(slug, config) {
  const category = config.categories.find((c) => c.slug === slug)
  return category ? category.label : "Merch"
}

function mapDetail(detail, config) {
  const { sync_product: syncProduct, sync_variants: syncVariants } = detail.result

  const variants = syncVariants
    .filter((v) => !v.is_ignored)
    .map((v) => ({
      id: String(v.id),
      name: v.name,
      size: v.size,
      color: v.color,
      colorCode: v.color_code || null,
      price: Number(v.retail_price),
      sku: v.sku || null,
      availabilityStatus: v.availability_status,
      productName: v.product ? v.product.name : null,
    }))

  const prices = variants.map((v) => v.price)
  const currency = syncVariants[0]?.currency || "USD"
  const category = detectCategory(
    syncProduct.name,
    variants.map((v) => v.productName),
    config
  )

  return {
    printfulId: syncProduct.id,
    name: syncProduct.name,
    category,
    categoryLabel: categoryLabelFor(category, config),
    thumbnailUrl: syncProduct.thumbnail_url,
    currency,
    priceFrom: prices.length ? Math.min(...prices) : null,
    priceTo: prices.length ? Math.max(...prices) : null,
    variants,
  }
}

async function fetchProducts({ apiKey, config }) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }

  const products = []
  let offset = 0
  while (true) {
    const page = await fetchJson(
      `${API_BASE}/store/products?limit=${PAGE_LIMIT}&offset=${offset}`,
      headers
    )
    products.push(...page.result)
    offset += PAGE_LIMIT
    if (offset >= page.paging.total) break
  }

  const mapped = []
  for (const summary of products) {
    if (summary.is_ignored) continue
    const detail = await fetchJson(`${API_BASE}/store/products/${summary.id}`, headers)
    mapped.push(mapDetail(detail, config))
  }
  return mapped
}

function writeSnapshot(products) {
  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true })
  fs.writeFileSync(
    SNAPSHOT_PATH,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), products },
      null,
      2
    )
  )
}

function readSnapshot() {
  try {
    const data = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"))
    return Array.isArray(data.products) ? data.products : null
  } catch {
    return null
  }
}

module.exports = {
  fetchProducts,
  writeSnapshot,
  readSnapshot,
  SNAPSHOT_PATH,
}
