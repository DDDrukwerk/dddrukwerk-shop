'use client'

import styles from './Footer.module.css'

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h4>DDDrukwerk</h4>
            <p>Premium custom merchandise gemaakt met aandacht voor detail.</p>
            <div className={styles.social}>
              <a href="https://instagram.com/dddrukwerk" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="mailto:info@dddrukwerk.nl">
                Email
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Producten</h4>
            <ul>
              <li><a href="#producten">Keychains</a></li>
              <li><a href="#producten">UV Prints</a></li>
              <li><a href="#producten">Ziekenhuisarmband</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Service</h4>
            <ul>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Verzending</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Contactgegevens</h4>
            <p>
              Email: <a href="mailto:info@dddrukwerk.nl">info@dddrukwerk.nl</a><br />
              Plaats: Heemskerk, Nederland<br />
              Instagram: <a href="https://instagram.com/dddrukwerk">@dddrukwerk</a>
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 DDDrukwerk. Alle rechten voorbehouden.</p>
          <div className={styles.payment}>
            <span>Betaalmethoden:</span>
            <span>💳 iDEAL | 🏦 Mollie</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
