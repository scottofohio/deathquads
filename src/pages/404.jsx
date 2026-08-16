import React from "react"
import { Link } from "gatsby"
import Layout from "../components/Layout"
import Seo from "../components/Seo"

export default function NotFoundPage() {
  return (
    <Layout>
      <h1 className="page-title">404 — Page not found</h1>
      <p className="page-subtitle">
        <Link to="/">Back to the store</Link>
      </p>
    </Layout>
  )
}

export function Head() {
  return <Seo title="Not found" />
}
