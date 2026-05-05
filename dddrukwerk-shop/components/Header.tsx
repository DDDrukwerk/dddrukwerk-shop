'use client'

import styles from './Header.module.css'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export default function Header({ cartCount, onCartClick }: HeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>DDDRUKWERK</h1>
          <p className={styles.tagline}>Premium Custom Merchandise</p>
        </div>

        <nav className={styles.nav}>
          <a href="#producten">Producten</a>
          <a href="#over">Over Ons</a>
          <a href="#contact">Contact</a>
          <button 
            className={styles.cartBtn}
            onClick={onCartClick}
          >
            🛒 Winkelwagen ({cartCount})
          </button>
        </nav>
      </div>
    </header>
  )
}
