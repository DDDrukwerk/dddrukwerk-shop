# 🚀 DDDrukwerk Webshop - QUICK START

## Wat je hebt
✅ Complete Next.js webshop (klaar om te deployen)
✅ DDDrukwerk huisstijl (zwart/goud)
✅ 4 producten (keychains + UV prints)
✅ Winkelwagen + checkout
✅ Mollie payment integration klaar

---

## 3 Stappen naar LIVE

### STAP 1: Lokaal testen (5 min)
```bash
cd dddrukwerk-shop
npm install
npm run dev
# Open http://localhost:3000
```

### STAP 2: Domein + Hosting (30 min)
1. **Domein**: TransIP.eu → "dddrukwerk.nl" (~€5/jaar)
2. **Hosting**: Vercel.com (free) → deploy je app
3. **Verbinden**: DNS nameservers updaten (15 min)

### STAP 3: Mollie betaling (10 min)
1. Account: Mollie.com
2. API key → in `.env.local`
3. Backend endpoint testen

---

## 📋 Files to know

| File | Purpose |
|------|---------|
| `components/ProductShowcase.tsx` | Producten/pricing |
| `components/Cart.tsx` | Winkelwagen + checkout |
| `app/globals.css` | Kleuren/fonts |
| `SETUP.md` | Gedetailleerde instructies |

---

## 💡 Tips

- **Test betaling** met Mollie test modus eerst
- **Instagram link** naar je domein (drive traffic!)
- **Backup je code** naar GitHub
- **Monitoring** → Vercel dashboard

---

**KLAAR? Start met Stap 1! 🎯**
