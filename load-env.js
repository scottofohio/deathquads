// Loads .env.<NODE_ENV> (e.g. .env.development for `gatsby develop`,
// .env.production for `gatsby build`), then falls back to a shared .env.
require("dotenv").config({
  path: require("path").resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
})
require("dotenv").config()
