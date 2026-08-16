import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import ProductCard from "../components/ProductCard"

export default function CategoryTemplate({ data, pageContext }) {
  const { label } = pageContext
  const products = data.allPrintfulProduct.nodes

  return (
    <Layout>
      <h1 className="page-title">{label}</h1>
      <p className="page-subtitle">{products.length} products</p>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No products in this category yet.</div>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query CategoryQuery($slug: String) {
    allPrintfulProduct(
      filter: { category: { eq: $slug } }
      sort: { name: ASC }
    ) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`

export function Head({ pageContext }) {
  return <Seo title={pageContext.label} />
}
