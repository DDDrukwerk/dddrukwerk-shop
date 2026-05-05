# 🚀 DDDrukwerk Webshop - Complete Deployment Guide

**Gemaakt door:** Claude AI  
**Voor:** Joaquim @ DDDrukwerk  
**Datum:** May 2026

---

## 📋 Table of Contents
1. [Lokaal testen](#lokaal-testen)
2. [GitHub setup](#github-setup)
3. [Vercel deployment](#vercel-deployment)
4. [Domein configuratie](#domein-configuratie)
5. [Mollie payments](#mollie-payments)
6. [Troubleshooting](#troubleshooting)

---

## 🧪 Lokaal testen

### Vereisten
- **Node.js 16+** (download van https://nodejs.org/)
- **Git** (download van https://git-scm.com/)

### Installatie
```bash
# Ga naar de map met je project
cd dddrukwerk-shop

# Installeer dependencies
npm install

# Start development server
npm run dev
```

**Output:**
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

Open: **http://localhost:3000** in je browser

### Test checklist
- [ ] Homepage laadt
- [ ] Producten zichtbaar (keychains + UV prints)
- [ ] Kan product selecteren ("Configureer →")
- [ ] Opties kiezen werkt (dropdown menu's)
- [ ] Hoeveelheid + prijs berekening werkt
- [ ] "In Winkelwagen" button werkt
- [ ] Winkelwagen opent met items
- [ ] Kan items verwijderen
- [ ] Checkout formulier verschijnt
- [ ] Responsive op mobiel (F12 → device toolbar)

Alles werkt? Prima! → **Ga door naar GitHub setup**

---

## 🐙 GitHub Setup

GitHub is nodig voor:
- ✅ Je code veilig opgeslagen
- ✅ Vercel kan automatisch deployen
- ✅ Backup van je website

### Stap 1: GitHub account aanmaken
1. Ga naar https://github.com
2. Klik **"Sign up"**
3. Email → Username → Password
4. Bevestig je email
5. **Je hebt je account!** ✅

### Stap 2: Repository aanmaken
1. Log in op GitHub
2. Klik **"+"** (top right) → **"New repository"**
3. **Repository name:** `dddrukwerk-shop`
4. **Description:** "Premium custom merchandise webshop"
5. **Public** (zodat Vercel het kan zien)
6. Klik **"Create repository"**

### Stap 3: Code pushen naar GitHub

In je terminal (in de dddrukwerk-shop folder):

```bash
# Initialiseer git (eenmalig)
git config --global user.name "Jouw Naam"
git config --global user.email "jouw@email.com"

# Zet je repository
git init
git add .
git commit -m "Initial DDDrukwerk webshop"

# Voeg remote toe (vervang USERNAME met je GitHub username)
git remote add origin https://github.com/USERNAME/dddrukwerk-shop.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

GitHub vraagt misschien om token:
1. Ga naar GitHub → Settings → Developer settings → Personal access tokens
2. Klik "Generate new token"
3. Naam: "Vercel"
4. Permissions: `repo` checken
5. Generate + kopieer token
6. Paste in terminal wanneer gevraagd

**Code staat nu op GitHub!** ✅

---

## ☁️ Vercel Deployment

Vercel host je website **gratis** en **automatisch**.

### Stap 1: Vercel account
1. Ga naar https://vercel.com
2. Klik **"Sign Up"**
3. Kies **"Continue with GitHub"**
4. Authorize Vercel
5. **Account gemaakt!** ✅

### Stap 2: Project connecten
1. Je bent automatisch op "New Project" pagina
2. Zoek `dddrukwerk-shop` in de list
3. Klik **"Import"**
4. Settings zijn ok (Next.js auto-detected)
5. Klik **"Deploy"**

**Wachten... 2-3 minuten...**

```
✓ Built successfully
✓ Deployed to: https://dddrukwerk-shop.vercel.app
```

**Je website is LIVE!** 🎉

Je krijgt automatisch:
- **URL:** `https://dddrukwerk-shop.vercel.app`
- **Automatic deployments** (elke keer je code pusht naar GitHub)
- **SSL certificate** (veilig)
- **CDN** (snel worldwide)

### Test je live site
1. Klik op de Vercel link
2. Controleer alles werkt (zoals lokaal)
3. Test op mobiel

---

## 🌐 Domein Configuratie

Nu moet je `dddrukwerk.nl` verbinden met je Vercel site.

### Stap 1: Domein kopen
**Optie A: TransIP (Nederlandse host)**
1. Ga naar https://www.transip.eu
2. Zoek `dddrukwerk.nl`
3. Voeg toe → Checkout → betaal (~€5/jaar)
4. Login in TransIP → Dashboard

**Optie B: Andere hosts**
- Namecheap.com
- GoDaddy.com
- Whois.com

### Stap 2: Domein koppelen aan Vercel

**In Vercel:**
1. Project → Settings → Domains
2. Voer in: `dddrukwerk.nl`
3. Klik Add
4. Vercel geeft je **nameservers**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```

**In TransIP (of je host):**
1. Login → Mijn TransIP → Domeinen
2. Klik op `dddrukwerk.nl`
3. Ga naar "DNS instellingen"
4. Verander nameservers → Vercel nameservers (hierboven)
5. Sla op

**Wachten:** 15-30 minuten (DNS propagatie)

**Check of het werkt:**
```bash
nslookup dddrukwerk.nl
# Zou Vercel nameservers moeten tonen
```

Voilà! Nu werkt: **https://dddrukwerk.nl** ✅

---

## 💳 Mollie Payments

Betaalmogelijkheden toevoegen (iDEAL, creditcard, etc.)

### Stap 1: Mollie account
1. Ga naar https://www.mollie.com/nl
2. Klik **"Gratis account"**
3. Vul bedrijfsgegevens in
4. Email bevestigen
5. Wacht op goedkeuring (~24 uur)

### Stap 2: API Key krijgen
1. Log in → Dashboard
2. Ga naar **Settings** → **API keys**
3. Kopieer **Live API key** (met `live_` prefix)

### Stap 3: Environment variable toevoegen
1. Open `.env.local` in je project:
   ```
   MOLLIE_API_KEY=live_xxxxxxxxxxxxx
   NEXT_PUBLIC_APP_URL=https://dddrukwerk.nl
   ```

2. Push naar GitHub:
   ```bash
   git add .env.local
   git commit -m "Add Mollie API key"
   git push
   ```

Vercel detected dit en deployt automatisch!

### Stap 4: Backend endpoint maken
(Optional nu, maar nodig voor betaling)

Maak bestand: `app/api/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items, customer, total } = await request.json()

    const mollieResponse = await fetch('https://api.mollie.com/v2/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MOLLIE_API_KEY}`,
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
          phone: customer.phone || ''
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        method: 'ideal'
      })
    })

    const order = await mollieResponse.json()

    if (!order._links?.checkout?.href) {
      throw new Error('No checkout URL')
    }

    return NextResponse.json({ 
      checkoutUrl: order._links.checkout.href 
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
```

Dan update `components/Cart.tsx` in `handleCheckout`:

```typescript
const handleCheckout = async () => {
  if (!customerInfo.name || !customerInfo.email || !customerInfo.address) {
    alert('Vul alle verplichte velden in')
    return
  }

  try {
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
    
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  } catch (error) {
    alert('Betaling kon niet gestart worden')
  }
}
```

---

## 📊 Je Setup is LIVE!

**Gefeliciteerd!** Je hebt nu:

✅ **Website:** https://dddrukwerk.nl  
✅ **GitHub repo:** https://github.com/jouwusername/dddrukwerk-shop  
✅ **Hosting:** Vercel (gratis, snel, schaalbaar)  
✅ **Code backups:** Automatisch  
✅ **SSL certificaat:** Automatisch  
✅ **Betalingen:** Mollie klaar  

---

## 📱 Promoten op Instagram

Nu je website live is:

1. **Update bio:** Link naar https://dddrukwerk.nl
2. **Stories:** "Check onze nieuwe webshop!"
3. **Posts:** Product showcase (keychains/UV prints)
4. **DM replies:** "Bestel op dddrukwerk.nl"

---

## 🔄 Updates & Changes

Elke keer je code aanpast:

```bash
# Maak je verandering
# Edit een bestand, bijv. price in ProductShowcase.tsx

# Push naar GitHub
git add .
git commit -m "Update product prices"
git push

# Vercel detecteert dit en deployed automatisch! ✅
```

Geen extra stappen nodig!

---

## 🆘 Troubleshooting

### "npm install" lukt niet
```bash
# Wis node_modules en probeer opnieuw
rm -rf node_modules
npm install
```

### Vercel deployment failed
1. Check GitHub repo is public
2. Check `package.json` bestaat
3. Check `next.config.js` correct is
4. Zie Vercel logs voor details

### Domein werkt niet
1. Wacht 30 min (DNS propagatie)
2. Wis browser cache (Ctrl+Shift+Del)
3. Check nameservers correct in TransIP

### Mollie payment not working
1. Check API key in `.env.local`
2. Check `.env.local` in `.gitignore` (secret!)
3. Check Mollie account goedgekeurd

---

## 💬 Support

- **Vercel:** https://vercel.com/help
- **Mollie:** https://www.mollie.com/nl/support
- **Next.js:** https://nextjs.org/docs
- **GitHub:** https://docs.github.com

---

## ✨ Je bent klaar!

Veel succes met DDDrukwerk! 🚀

Vragen? Ik help je graag.
