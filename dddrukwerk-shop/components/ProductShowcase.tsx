'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './ProductShowcase.module.css'

interface ProductOption {
  [key: string]: string[]
}

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  category: string
  options: ProductOption
}

interface CartItem {
  id: string
  name: string
  basePrice: number
  quantity: number
  customization: Record<string, string>
  totalPrice: string
  category: string
  description: string
  options: ProductOption
}

interface ProductShowcaseProps {
  onAddToCart: (product: CartItem) => void
}

interface Toast {
  message: string
  productName: string
}

const PRODUCTS: Product[] = [
  {
    id: 'keychain-basic',
    name: 'Standard Keychain',
    description: 'Klassieke PLA keychain, perfect voor branding',
    basePrice: 3.50,
    category: 'keychain',
    options: {
      material: ['PLA zwart', 'PLA wit', 'PLA transparant'],
      size: ['Klein (2cm)', 'Standaard (3cm)', 'Groot (4cm)'],
      addOns: ['Ring/clip (+€0.50)', 'Extra gravering (+€1.00)']
    }
  },
  {
    id: 'keychain-premium',
    name: 'Premium Keychain',
    description: 'Multi-color design met details',
    basePrice: 5.99,
    category: 'keychain',
    options: {
      material: ['PLA mix', 'PLA metallic'],
      size: ['Standaard (3cm)', 'Groot (4cm)'],
      addOns: ['Ring/clip (+€0.50)', 'Premium verpakking (+€2.00)']
    }
  },
  {
    id: 'uv-print-small',
    name: 'UV Print Kleinformat',
    description: 'Kleurrijke UV print tot 10x10cm',
    basePrice: 4.99,
    category: 'uv',
    options: {
      size: ['5x5cm', '10x10cm'],
      material: ['Acryl', 'Hout', 'Metaal'],
      coating: ['Mat', 'Glans', 'Semi-glans']
    }
  },
  {
    id: 'uv-print-medium',
    name: 'UV Print Mediumformat',
    description: 'Professionele UV prints tot 20x20cm',
    basePrice: 8.99,
    category: 'uv',
    options: {
      size: ['15x15cm', '20x20cm'],
      material: ['Acryl', 'Hout', 'Metaal', 'Glas'],
      coating: ['Mat', 'Glans'],
      lamination: ['Geen', 'UV-beschermlaag (+€2.00)']
    }
  }
]

export default function ProductShowcase({ onAddToCart }: ProductShowcaseProps): JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [customization, setCustomization] = useState<Record<string, string>>({})
  const [selectedQty, setSelectedQty] = useState<number>(1)
  const [toast, setToast] = useState<Toast | null>(null)

  const current = PRODUCTS.find(p => p.id === selectedProduct)

  const calculatePrice = (): string => {
    if (!current) return '0.00'
    let price = current.basePrice * selectedQty

    Object.values(customization).forEach(option => {
      const match = option.match(/\+€([\d.]+)/)
      if (match) price += parseFloat(match[1]) * selectedQty
    })

    return price.toFixed(2)
  }

  const handleAddToCart = (): void => {
    if (!current) return

    const cartItem: CartItem = {
      ...current,
      customization,
      quantity: selectedQty,
      totalPrice: calculatePrice()
    }

    onAddToCart(cartItem)
    
    // Show custom toast instead of alert
    setToast({
      message: 'toegevoegd aan winkelwagen!',
      productName: current.name
    })
    
    // Auto-hide after 3 seconds
    setTimeout(() => setToast(null), 3000)
    
    setSelectedProduct(null)
    setCustomization({})
    setSelectedQty(1)
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target
    setCustomization({
      ...customization,
      [name]: value
    })
  }

  const handleQtyChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setSelectedQty(value)
    }
  }

  return (
    <section id="producten" className={styles.showcase}>
      <div className={styles.container}>
        <h2 className={styles.title}>Onze Collectie</h2>
        <p className={styles.subtitle}>
          Kies uit keychains, UV prints en meer. Volledig aanpasbaar naar jouw wensen.
        </p>

        <div className={styles.grid}>
          {PRODUCTS.map(product => (
            <div 
              key={product.id}
              className={`${styles.card} ${selectedProduct === product.id ? styles.active : ''}`}
              onClick={() => setSelectedProduct(product.id)}
            >
              <div className={styles.icon}>
                {product.category === 'keychain' ? '🔑' : '🎨'}
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className={styles.price}>
                Vanaf <strong>€{product.basePrice.toFixed(2)}</strong>
              </div>
              <button className={styles.selectBtn}>
                Configureer →
              </button>
            </div>
          ))}
        </div>

        {selectedProduct && current && (
          <div className={styles.customizer}>
            <div className={styles.customizerContent}>
              <button 
                className={styles.closeBtn}
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>

              <h3>{current.name}</h3>
              
              <div className={styles.options}>
                {Object.entries(current.options).map(([optionKey, values]) => (
                  <div key={optionKey} className={styles.optionGroup}>
                    <label htmlFor={optionKey}>
                      {optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}
                    </label>
                    <select
                      id={optionKey}
                      name={optionKey}
                      value={customization[optionKey] || ''}
                      onChange={handleSelectChange}
                    >
                      <option value="">-- Selecteer --</option>
                      {values.map((v: string) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className={styles.qtyPrice}>
                <div>
                  <label htmlFor="quantity">Hoeveelheid</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="1000"
                    value={selectedQty}
                    onChange={handleQtyChange}
                  />
                </div>
                <div className={styles.totalPrice}>
                  <span>Totaal:</span>
                  <strong>€{calculatePrice()}</strong>
                </div>
              </div>

              <button 
                className={styles.addBtn}
                onClick={handleAddToCart}
              >
                In Winkelwagen
              </button>
            </div>
          </div>
        )}

        {/* Custom Toast Notification */}
        {toast && (
          <div className={styles.toast}>
            <div className={styles.toastContent}>
              ✓ <strong>{toast.productName}</strong> {toast.message}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
