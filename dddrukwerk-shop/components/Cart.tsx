'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './Cart.module.css'

interface CartItem {
  id: string
  name: string
  basePrice: number
  quantity: number
  customization: Record<string, string>
  totalPrice: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipcode: string
}

interface CartProps {
  items: CartItem[]
  onRemove: (index: number) => void
  onClose: () => void
}

type CheckoutStep = 'review' | 'checkout'

export default function Cart({ items, onRemove, onClose }: CartProps): JSX.Element {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('review')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
  })

  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    })
  }

  const handleCheckout = async (): Promise<void> => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
      alert('Vul alle verplichte velden in')
      return
    }

    // In production, this would call your backend to create a Mollie payment
    console.log('Checkout data:', {
      items,
      customer: customerInfo,
      total: totalPrice
    })

    alert('Bestellingsproces gestart! In production integreert dit met Mollie.')
  }

  return (
    <div className={styles.cartOverlay}>
      <div className={styles.cartPanel}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2>Winkelwagen</h2>

        {items.length === 0 ? (
          <p className={styles.empty}>Je winkelwagen is leeg</p>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p className={styles.customization}>
                      {Object.values(item.customization).filter(v => v).join(' • ')}
                    </p>
                    <p className={styles.qty}>Hoeveelheid: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    <strong>€{item.totalPrice}</strong>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => onRemove(idx)}
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotaal:</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Verzending:</span>
                <span>€3.50</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Totaal:</span>
                <strong>€{(totalPrice + 3.50).toFixed(2)}</strong>
              </div>
            </div>

            {checkoutStep === 'review' ? (
              <button 
                className={styles.checkoutBtn}
                onClick={() => setCheckoutStep('checkout')}
              >
                Doorgaan naar Betaling
              </button>
            ) : (
              <div className={styles.checkoutForm}>
                <h3>Bestelgegevens</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="name">Naam *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Volledige naam"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="je@voorbeeld.nl"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Telefoonnummer</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="06 12345678"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Adres *</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Straat en huisnummer"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipcode">Postcode</label>
                    <input
                      id="zipcode"
                      type="text"
                      name="zipcode"
                      value={customerInfo.zipcode}
                      onChange={handleInputChange}
                      placeholder="1234 AB"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">Plaats</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Amsterdam"
                    />
                  </div>
                </div>

                <button 
                  className={styles.payBtn}
                  onClick={handleCheckout}
                >
                  Betaal met iDEAL (Mollie)
                </button>

                <button 
                  className={styles.backBtn}
                  onClick={() => setCheckoutStep('review')}
                >
                  Terug naar winkelwagen
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
