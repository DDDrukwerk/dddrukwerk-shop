'use client'

import styles from './Hero.module.css'

export default function Hero(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Handgemaakte Kwaliteit<br />
            <span className={styles.highlight}>Op Maat Gemaakt</span>
          </h2>
          <p className={styles.subtitle}>
            Premium keychains en UV prints die jouw merk tot leven brengen
          </p>
          <button className={styles.cta}>
            Ontdek Onze Collectie
          </button>
        </div>

        <div className={styles.visual}>
          <div className={styles.box1}></div>
          <div className={styles.box2}></div>
          <div className={styles.box3}></div>
        </div>
      </div>
    </section>
  )
}
