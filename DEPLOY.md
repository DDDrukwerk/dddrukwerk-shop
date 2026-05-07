# DDDrukwerk Offerte Generator — Deployment

## Lokale ontwikkeling

```bash
cd dddrukwerk-quotes
npm install
cp .env.example .env        # Vul bedrijfsgegevens in
node api/index.js            # Start op http://localhost:3000
```

## Vercel deployment

### 1. Installeer Vercel CLI
```bash
npm install -g vercel
```

### 2. Login & deploy
```bash
vercel login
vercel --prod
```

### 3. Omgevingsvariabelen instellen (Vercel dashboard)
Ga naar: **Vercel Dashboard → Project → Settings → Environment Variables**

| Variabele         | Waarde                     |
|-------------------|----------------------------|
| COMPANY_NAME      | DDDrukwerk                 |
| COMPANY_ADDRESS   | Uw straatnaam 123          |
| COMPANY_CITY      | 1234 AB Amsterdam          |
| COMPANY_PHONE     | 020-1234567                |
| COMPANY_EMAIL     | info@dddrukwerk.nl         |
| COMPANY_WEBSITE   | www.dddrukwerk.nl          |
| COMPANY_KVK       | 12345678                   |
| COMPANY_BTW       | NL123456789B01             |
| COMPANY_IBAN      | NL12 ABCD 0123 4567 89     |

### 4. Eigen domein koppelen (quote.dddrukwerk.nl)
1. Vercel Dashboard → Project → **Settings → Domains**
2. Voeg toe: `quote.dddrukwerk.nl`
3. Maak bij uw DNS-provider een **CNAME record** aan:
   - Naam: `quote`
   - Waarde: `cname.vercel-dns.com`
4. Vercel valideert automatisch (duurt 0–24u)

## Projectstructuur

```
dddrukwerk-quotes/
├── api/
│   └── index.js        ← Express server (Vercel serverless)
├── public/
│   └── index.html      ← Frontend (statisch via Vercel CDN)
├── vercel.json         ← Vercel routering
├── package.json
├── .env.example
└── DEPLOY.md
```

## Prijzen aanpassen

Bewerk `api/index.js` → `PRODUCTS` object voor staffelprijzen.  
Bewerk `ADDONS` object voor opties en toevoegingen.

Na aanpassing: `vercel --prod` om opnieuw te deployen.
