import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { CartProvider, useCart } from "./CartContext"
import AddedToCartModal from "./AddedToCartModal"
import logo from "../images/logo.svg"

function SiteFrame({ children }) {
  const { site } = useStaticQuery(graphql`
    query LayoutSiteMetadata {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const { addedItem, clearAddedItem, openCart } = useCart()

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-logo-link" to="/" aria-label={site.siteMetadata.title}>
            <img
              className="site-logo"
              src={logo}
              alt={site.siteMetadata.title}
            />
          </Link>
          <nav className="site-nav">
            <Link to="/hoodies">Hoodies</Link>
            <Link to="/t-shirts">T-Shirts</Link>
          </nav>
          <span className="site-header-spacer" />
          <button className="cart-button snipcart-checkout" type="button">
            <span className="cart-count snipcart-items-count">0</span>
            Cart
          </button>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        © {new Date().getFullYear()} {site.siteMetadata.title}. All rights
        reserved.
      </footer>
      <AddedToCartModal
        item={addedItem}
        onClose={clearAddedItem}
        onViewCart={() => {
          clearAddedItem()
          openCart()
        }}
      />
    </>
  )
}

export default function Layout({ children }) {
  return (
    <CartProvider>
      <SiteFrame>{children}</SiteFrame>
    </CartProvider>
  )
}
