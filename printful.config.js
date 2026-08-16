// Categories are matched against each product's name AND the underlying
// Printful catalog product name (e.g. "...T-Shirt..." / "...Hoodie...").
// Order matters: the first category whose matcher hits wins.
module.exports = {
  categories: [
    {
      slug: "hoodies",
      label: "Hoodies",
      matchers: [/hoodie/i, /sweatshirt/i, /pullover/i],
    },
    {
      slug: "t-shirts",
      label: "T-Shirts",
      matchers: [/t-?shirt/i, /t\.?shirt/i, /tee/i, /jersey/i, /long\s*sleeve/i],
    },
  ],
  // If a product matches no category it still shows on the home page,
  // just not on any category page.
  overrides: {},
}
