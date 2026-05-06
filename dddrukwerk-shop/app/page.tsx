'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductShowcase from '@/components/ProductShowcase'
import Cart from '@/components/Cart'
import Footer from '@/components/Footer'

interface CartItem {
  id: string
  name: string
  basePrice: number
  quantity: number
  customization: Record<string, string>
  totalPrice: string
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: CartItem): void => {
    setCart([...cart, product])
  }

  const removeFromCart = (index: number): void => {
    setCart(cart.filter((_, i) => i !== index))
  }

  return (
    <>
      <Header 
        cartCount={cart.length} 
        onCartClick={() => setCartOpen(!cartOpen)} 
      />
      
      <main>
        <Hero />
        <ProductShowcase onAddToCart={addToCart} />
      </main>

      {cartOpen && (
        <Cart 
          items={cart} 
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
        />
      )}

      <Footer />
    </>
  )
}
