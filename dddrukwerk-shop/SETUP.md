# DDDrukwerk Webshop - Setup & Deployment Guide

## 📦 Wat je hebt gekregen

Een **complete Next.js e-commerce app** met:
- ✅ Professioneel DDDrukwerk design (black/gold huisstijl)
- ✅ Keychains + UV print producten (fully customizable)
- ✅ Shopping cart met prijs berekening
- ✅ Checkout formulier klaar voor Mollie integratie
- ✅ Responsive design (desktop/mobile)

---

## 🚀 Stap 1: Lokaal testen

### 1.1 Node.js installeren
Download en installeer Node.js: https://nodejs.org/ (LTS versie)

### 1.2 App setup
```bash
cd dddrukwerk-shop
npm install
npm run dev
```

Open: http://localhost:3000

Je webshop draait nu lokaal! Test:
- ✅ Keychains en UV prints bekijken
- ✅ Producten configureren (opties kiezen)
- ✅ Winkelwagen toevoegen/verwijderen
- ✅ Checkout formulier invullen

---

## 🌐 Stap 2: Domein registreren (dddrukwerk.nl)

### 2.1 Domein kopen
Opties:
- **TransIP** (Nederlandse host) - €4-8/jaar
- **Namecheap** (goedkoop, international)
- **Whois.com**

Stap-voor-stap:
1. Ga naar TransIP.eu
2. Zoek "dddrukwerk.nl"
3. Kies het domein, klik "Toevoegen"
4. Volg checkout → betaling (iDEAL)
5. Je hebt het domein! 🎉

**Kosten:** ~€5/jaar

---

## ☁️ Stap 3: Deployen op Vercel (GRATIS)

### 3.1 GitHub setup
```bash
# In je dddrukwerk-shop folder
git init
git add .
git commit -m "Initial DDDrukwerk webshop"
```

### 3.2 Vercel deployment
1. Ga naar https://vercel.com
2. Klik "Sign Up" → maak account
3. Klik "New Project"
4. Selecteer je dddrukwerk-shop GitHub repo (importeer hem eerst naar GitHub!)
5. Klik "Deploy"

**Vercel zet je app live in ~2 minuten! ✅**

### 3.3 Domein verbinden
1. In Vercel project → "Settings" → "Domains"
2. Voer "dddrukwerk.nl" in
3. Volg de DNS instructies (wijzig nameservers in TransIP)
4. ~15 min wachten, klaar!

**Kosten:** €0/maand (gratis Vercel, betaal alleen domein)

---

## 💳 Stap 4: Mollie Payment Integratie

### 4.1 Mollie account
1. Ga naar https://www.mollie.com/nl
2. Klik "Registreer je"
3. Vul bedrijfsgegevens in
4. Approve: goedkeuring ~24 uur

### 4.2 API Key ophalen
1. Log in → Dashboard
2. Ga naar "Settings" → "API keys"
3. Kopieer je Live API key

### 4.3 Backend endpoint maken
Je moet een kleine backend toevoegen. Vervel + Next.js API Routes:

**Bestand: `app/api/checkout/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { items, customer, total } = await request.json()

  // Mollie API call
  const mollieResponse = await fetch('https://api.mollie.com/v2/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_MOLLIE_API_KEY`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: {
        value: total.toFixed(2),
        currency: 'EUR'
      },
      orderNumber: `ORDER-${Date.now()}`,
      lines: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: {
          value: (parseFloat(item.totalPrice) / item.quantity).toFixed(2),
          currency: 'EUR'
        }
      })),
      billingAddress: {
        givenName: customer.name.split(' ')[0],
        familyName: customer.name.split(' ').slice(1).join(' '),
        email: customer.email,
        streetAndNumber: customer.address,
        city: customer.city,
        postalCode: customer.zipcode,
        country: 'NL',
        phone: customer.phone
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      method: 'ideal'
    })
  })

  const order = await mollieResponse.json()
  return NextResponse.json({ 
    checkoutUrl: order._links.checkout.href 
  })
}
```

### 4.4 Environment variables
Maak `.env.local` file:

```
MOLLIE_API_KEY=your_mollie_api_key_here
NEXT_PUBLIC_APP_URL=https://dddrukwerk.nl
```

### 4.5 Cart.tsx updaten
In `components/Cart.tsx`, replace `handleCheckout`:

```typescript
const handleCheckout = async () => {
  if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
    alert('Vul alle verplichte velden in')
    return
  }

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      customer: customerInfo,
      total: totalPrice + 3.50
    })
  })

  const { checkoutUrl } = await response.json()
  window.location.href = checkoutUrl  // Redirect naar Mollie
}
```

---

## 📊 Stap 5: Order Management

### Eenvoudig systeem
1. **Mollie emails je per order** → kan je handmatig verwerken
2. **Webhook setup** (optional, voor automation later)

Mollie stuurt:
- Order bevestiging naar klant
- Order notificatie naar jou
- Je hebt alle details (adres, configuratie, etc.)

---

## 🎨 Stap 6: Aanpassingen & Updates

### Producten toevoegen/wijzigen
Bewerk: `components/ProductShowcase.tsx`

```typescript
const PRODUCTS = [
  {
    id: 'keychain-custom',
    name: 'Mijn Custom Keychain',
    description: '...',
    basePrice: 4.99,
    // ... rest
  }
]
```

Deploy naar Vercel:
```bash
git add .
git commit -m "Add new product"
git push
```

Vercel deploys automatisch! ✅

### Design aanpassen
Aanpassen in:
- `app/globals.css` → huisstijl colors/fonts
- `components/*/module.css` → specifieke styling
- `components/*.tsx` → content/structure

---

## 📱 Checklist - Je webshop is LIVE!

- [ ] Domein geregistreerd (dddrukwerk.nl)
- [ ] App op Vercel gedeployed
- [ ] Domein met Vercel verbonden
- [ ] Mollie account aangemaakt
- [ ] API key ingesteld
- [ ] Backend endpoint live
- [ ] Testorder geplaatst
- [ ] Links op Instagram profiel ✅

---

## 💰 Kosten per maand

| Item | Kosten |
|------|--------|
| Domein (dddrukwerk.nl) | ~€0.40/maand |
| Vercel hosting | €0 (gratis) |
| Mollie payments | 2.2% + €0.29 per order |
| **Totaal** | **~€1/maand + transactiekosten** |

Veel goedkoper dan WooCommerce! 🎯

---

## 🆘 Vragen?

- **Vercel issues:** https://vercel.com/support
- **Mollie integratie:** https://www.mollie.com/nl/developers
- **Next.js docs:** https://nextjs.org/docs

Veel succes met DDDrukwerk! 🚀
