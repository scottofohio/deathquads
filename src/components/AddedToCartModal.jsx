import React from "react"

function formatPrice(currency, value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(value)
}

function customValue(item, name) {
  const field = (item.customFields || []).find((f) => f.name === name)
  return field ? field.value : null
}

export default function AddedToCartModal({ item, onClose, onViewCart }) {
  if (!item) return null

  const size = customValue(item, "Size")
  const color = customValue(item, "Color")
  const details = [size, color].filter(Boolean).join(" · ")

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Item added to cart"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="modal-title">Added to cart</h3>
        <div className="modal-item">
          {item.image && (
            <img
              className="modal-item-image"
              src={item.image}
              alt={item.name}
            />
          )}
          <div>
            <p className="modal-item-name">{item.name}</p>
            {details && <p className="modal-item-detail">{details}</p>}
            <p className="modal-item-price">
              {formatPrice(item.currency, item.price)}
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="modal-primary"
            type="button"
            onClick={onViewCart}
          >
            View cart
          </button>
          <button
            className="modal-secondary"
            type="button"
            onClick={onClose}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
