# ✅ DDDrukwerk Webshop - COMPLETE SETUP CHECKLIST

**Alles is klaar!** Hier is jouw step-by-step plan.

---

## 📦 Wat je hebt gekregen

### Files
- ✅ `dddrukwerk-shop-complete.tar.gz` — Alle code + files
- ✅ `DEPLOYMENT.md` — Gedetailleerde instructies
- ✅ `QUICK_START.md` — TL;DR versie
- ✅ `SETUP.md` — Alte setup details
- ✅ `dddrukwerk_priority_list.md` — Je workflow optimalisaties

### In het package:
```
dddrukwerk-shop/
├── app/                (Next.js pages + styling)
├── components/         (Header, Hero, Products, Cart, Footer)
├── package.json        (Dependencies)
├── next.config.js      (Config)
├── .gitignore          (Git settings)
├── .env.example        (Template voor secrets)
├── DEPLOYMENT.md       (LEES DIT EERST)
└── README.md           (Project info)
```

---

## 🚀 4 Stappen naar LIVE

### ⏱️ STAP 1: Lokaal testen (10 min)

```bash
# 1. Extract het .tar.gz bestand
tar -xzf dddrukwerk-shop-complete.tar.gz
cd dddrukwerk-shop

# 2. Install Node.js (eenmalig)
# Download: https://nodejs.org/ (LTS version)
# Install het

# 3. Install dependencies
npm install

# 4. Start local server
npm run dev

# Open http://localhost:3000
```

**Check:**
- [ ] Website laadt
- [ ] Producten zichtbaar
- [ ] Kan product toevoegen aan winkelwagen
- [ ] Checkout werkt

**Klaar?** → Ga naar Stap 2

---

### ⏱️ STAP 2: GitHub (15 min)

**Maak account:**
1. Ga naar https://github.com
2. "Sign up" → maak account

**Maak repository:**
1. Log in → "+" → "New repository"
2. Naam: `dddrukwerk-shop`
3. Public → Create

**Push je code:**
```bash
git config --global user.name "Jouw Naam"
git config --global user.email "jouw@email.nl"

git init
git add .
git commit -m "Initial DDDrukwerk webshop"
git remote add origin https://github.com/JOUWUSERNAME/dddrukwerk-shop.git
git branch -M main
git push -u origin main
```

**Klaar?** → Ga naar Stap 3

---

### ⏱️ STAP 3: Vercel (5 min)

**Ga naar:** https://vercel.com
1. "Sign Up"
2. "Continue with GitHub"
3. Authorize
4. Selecteer `dddrukwerk-shop` repo
5. Click "Import"
6. Click "Deploy"

**Wachten...** (2-3 min)

Je krijgt automatisch:
- ✅ Live URL: `https://dddrukwerk-shop.vercel.app`
- ✅ SSL certificaat
- ✅ Auto-deployments (elke push gaat live!)

**Klaar?** → Ga naar Stap 4

---

### ⏱️ STAP 4: Domein (20 min)

**Koop domein:**
1. Ga naar https://www.transip.eu
2. Zoek `dddrukwerk.nl`
3. Voeg toe → Betaal (~€5/jaar)
4. Login in TransIP

**Verbind met Vercel:**
1. Vercel project → Settings → Domains
2. Voer `dddrukwerk.nl` in
3. Vercel geeft nameservers
4. In TransIP → DNS settings → Vul nameservers in
5. Wachten 15-30 min

**Voilà!** → https://dddrukwerk.nl werkt! 🎉

---

## 💳 OPTIONEEL: Mollie Payments

Wil je echte betalingen aannemen?

1. Ga naar https://www.mollie.com/nl
2. Maak account
3. Wacht op goedkeuring (~24u)
4. Settings → API keys → Copy Live key
5. In je project: `.env.local` → `MOLLIE_API_KEY=live_xxxxx`
6. Push naar GitHub → Vercel deployt automatisch

Mollie is **gratis** om te starten. Betaal alleen transactiekosten (2.2% + €0.29).

---

## 📱 Instagram promotie

Nu je website live is:

1. **Bio update:** Link naar https://dddrukwerk.nl
2. **Story:** "Ontdek onze nieuwe webshop!"
3. **Post:** Product showcase
4. **DM:** "Bestel op dddrukwerk.nl"

---

## 🔄 Updates maken

Elke keer je iets verandert:

```bash
# 1. Pas bestand aan (bijv. prijs, product naam, etc.)
# 2. Commit & push
git add .
git commit -m "Update product prices"
git push

# 3. Vercel deployt automatisch! ✅
# Zie https://vercel.com/dashboard
```

---

## ❓ Vragen?

**Problemen?** Zie `DEPLOYMENT.md` → Troubleshooting sectie

**Snelle links:**
- GitHub docs: https://docs.github.com
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs

---

## 💰 Kosten per maand

| Item | Kosten |
|------|--------|
| Domein | ~€0.40/maand |
| Hosting (Vercel) | €0 (gratis!) |
| Betalingen (Mollie) | 2.2% + €0.29 per order |
| **Totaal** | **~€0.50 + transactie** |

💡 Veel goedkoper dan WooCommerce/Squarespace!

---

## ✅ SUCCESS CHECKLIST

- [ ] GitHub account aangemaakt
- [ ] dddrukwerk-shop repo op GitHub
- [ ] Vercel deployment live
- [ ] Domain `dddrukwerk.nl` werkt
- [ ] Website op https://dddrukwerk.nl bereikbaar
- [ ] Instagram link updated
- [ ] (Optional) Mollie payments ingesteld
- [ ] Eerste testorder geplaatst

**Alles afgevinkt? GEFELICITEERD!** 🎉

Je DDDrukwerk webshop is LIVE! 🚀

---

## 📞 Follow-up

Zodra je online bent:
1. Test met echte bezoek (vrienden/familie)
2. Test checkout proces
3. Check social media stats
4. Optimaliseer producten op feedback

Veel succes! 💪
