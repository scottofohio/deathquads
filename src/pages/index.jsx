import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import ProductCard from "../components/ProductCard"

export default function IndexPage({ data }) {
  const products = data.allPrintfulProduct.nodes

  return (
    <Layout>
      <h1 className="page-title">All Merch</h1>
      <p className="page-subtitle">{products.length} products</p>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No products yet.</div>
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    allPrintfulProduct(sort: { name: ASC }) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`

export function Head() {
  return <Seo />
}
