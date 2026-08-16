import React, { useEffect, useMemo, useState } from "react"
import { graphql } from "gatsby"
import { useCart } from "./CartContext"

function formatPrice(currency, value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(value)
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)

  const colors = useMemo(() => {
    const seen = []
    for (const v of product.variants) {
      if (!seen.includes(v.color)) seen.push(v.color)
    }
    return seen
  }, [product.variants])

  const sizes = useMemo(() => {
    const seen = []
    for (const v of product.variants) {
      if (v.color === color && !seen.includes(v.size)) seen.push(v.size)
    }
    return seen
  }, [product.variants, color])

  useEffect(() => {
    if (colors.length && !color) setColor(colors[0])
  }, [colors, color])

  useEffect(() => {
    if (sizes.length && !sizes.includes(size)) setSize(sizes[0])
  }, [sizes, size])

  const selected = product.variants.find(
    (v) => v.color === color && v.size === size
  )
  const soldOut = Boolean(selected && selected.availabilityStatus !== "active")

  function handleAdd() {
    if (!selected || soldOut) return
    addToCart({
      id: selected.id,
      name: product.name,
      price: selected.price,
      url: "/",
      image: product.thumbnailUrl,
      description: `${product.categoryLabel} · ${selected.color}`,
      currency: product.currency,
      quantity: 1,
      customFields: [
        { name: "Size", value: selected.size },
        { name: "Color", value: selected.color },
      ],
    })
  }

  const priceLabel =
    product.priceFrom === product.priceTo
      ? formatPrice(product.currency, product.priceFrom)
      : `${formatPrice(product.currency, product.priceFrom)} – ${formatPrice(
          product.currency,
          product.priceTo
        )}`

  return (
    <article className="product-card">
      <img
        className="product-image"
        src={product.thumbnailUrl}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">{priceLabel}</p>
        <div className="product-controls">
          <select
            aria-label="Color"
            value={color ?? ""}
            onChange={(event) => setColor(event.target.value)}
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            aria-label="Size"
            value={size ?? ""}
            onChange={(event) => setSize(event.target.value)}
          >
            {sizes.map((s) => {
              const variant = product.variants.find(
                (v) => v.color === color && v.size === s
              )
              const unavailable =
                variant && variant.availabilityStatus !== "active"
              return (
                <option key={s} value={s} disabled={unavailable}>
                  {s}
                  {unavailable ? " — sold out" : ""}
                </option>
              )
            })}
          </select>
        </div>
        {soldOut ? (
          <div className="sold-out">Sold out</div>
        ) : (
          <button
            className="add-to-cart"
            type="button"
            onClick={handleAdd}
            disabled={!selected}
          >
            Add to cart
          </button>
        )}
      </div>
    </article>
  )
}

export const ProductCardFields = graphql`
  fragment ProductCardFields on PrintfulProduct {
    id
    name
    categoryLabel
    thumbnailUrl
    currency
    priceFrom
    priceTo
    variants {
      id
      size
      color
      price
      availabilityStatus
    }
  }
`
