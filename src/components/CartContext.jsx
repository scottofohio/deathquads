import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

const CartContext = createContext(null)

function waitForSnipcart(timeout = 8000) {
  return new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      if (window.Snipcart?.api?.cart?.items) return resolve(true)
      if (Date.now() - start > timeout) return resolve(false)
      setTimeout(check, 100)
    }
    check()
  })
}

export function CartProvider({ children }) {
  const [addedItem, setAddedItem] = useState(null)

  const addToCart = useCallback(async (item) => {
    const ready = await waitForSnipcart()
    if (!ready) {
      console.warn("Snipcart is not loaded — could not add item")
      return false
    }
    try {
      await window.Snipcart.api.cart.items.add(item)
      setAddedItem(item)
      return true
    } catch (err) {
      console.error("Failed to add item to cart", err)
      return false
    }
  }, [])

  const openCart = useCallback(() => {
    const checkout = document.querySelector(".snipcart-checkout")
    if (checkout) {
      checkout.click()
      return true
    }
    return false
  }, [])

  const clearAddedItem = useCallback(() => setAddedItem(null), [])

  const value = useMemo(
    () => ({ addToCart, openCart, addedItem, clearAddedItem }),
    [addToCart, openCart, addedItem, clearAddedItem]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside <CartProvider>")
  return context
}
