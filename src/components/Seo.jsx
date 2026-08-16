import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Seo({ title, description }) {
  const { site } = useStaticQuery(graphql`
    query SeoSiteMetadata {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const fullTitle = title
    ? `${title} · ${site.siteMetadata.title}`
    : site.siteMetadata.title

  return (
    <>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
    </>
  )
}
