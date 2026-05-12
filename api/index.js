require('dotenv').config();
const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Rate limiting ─────────────────────────────────────────────────────────────
// Algemeen: max 60 API-verzoeken per minuut per IP
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.' }
}));

// Strenger voor PDF-generatie: max 10 offertes per uur per IP
app.use('/api/quote/pdf', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'U heeft het maximale aantal offertes per uur bereikt. Probeer het later opnieuw.' }
}));

// ─── Productcatalogus (exact uit dddrukwerk-shop) ─────────────────────────────
// Staffelprijzen zijn schattingen op basis van de basisprijs — pas aan naar wens.

// Setup/design kosten (eenmalig, alleen bij nieuwe klanten / nieuw design)
const SETUP_FEE = { key: 'setup_fee', name: 'Setup & design kosten (eenmalig)', price: 25.00, priceType: 'flat' };

const PRODUCTS = {
  'keychain-basic': {
    name: 'Sleutelhanger Basic',
    description: '3D geprint met PLA op de Bambu Lab P1S — strak, duurzaam en volledig op maat',
    unit: 'stuk',
    setupFee: false,   // Geen setup/design kosten voor dit product
    image:'/images/sleutelhanger-basic.png',
    tiers: [
      { min: 1,   max: 25,       price: 2.25 },
      { min: 26,  max: 50,       price: 1.90 },
      { min: 51,  max: 99,       price: 1.50 },
      { min: 100, max: Infinity, price: 1.13 }
    ],
    selects: [
      { key: 'kleur', label: 'PLA kleur', options: ['Zwart', 'Wit', 'Transparant', 'Grijs', 'Rood', 'Blauw'] },
      { key: 'size',  label: 'Formaat',   options: ['Klein (2cm)', 'Standaard (3cm)', 'Groot (4cm)'] }
    ],
    addons: [
      { key: 'ring_clip',      name: 'Ring/clip hardware',   price: 0.50, priceType: 'per_unit' },
      { key: 'uv_print_logo',  name: 'UV print logo/tekst',  price: 1.50, priceType: 'per_unit' }
    ]
  },
  'keychain-premium': {
    name: 'Sleutelhanger Premium',
    description: 'Multi-color 3D print met UV Resin kleurdetails — voor een luxe uitstraling',
    unit: 'stuk',
    image: '/images/sleutelhanger-premium.png',
    // Kostprijs: ~€0.70 materiaal + UV-inkt, ~15-25 min arbeid per stuk
    // Marge: 38-45%
    tiers: [
      { min: 1,   max: 25,       price: 7.50 },  // kostprijs ~€4.40
      { min: 26,  max: 50,       price: 6.00 },  // kostprijs ~€3.50
      { min: 51,  max: 99,       price: 4.75 },  // kostprijs ~€2.75
      { min: 100, max: Infinity, price: 3.75 }   // kostprijs ~€2.20
    ],
    selects: [
      { key: 'kleur', label: 'Basiskleur PLA', options: ['Zwart', 'Wit', 'Zilver', 'Goud metallic'] },
      { key: 'size',  label: 'Formaat',        options: ['Standaard (3cm)', 'Groot (4cm)'] }
    ],
    addons: [
      { key: 'ring_clip',          name: 'Ring/clip hardware',   price: 0.50, priceType: 'per_unit' },
      { key: 'premium_verpakking', name: 'Premium verpakking',   price: 2.00, priceType: 'per_unit' }
    ]
  },
  'uv-print-small': {
    name: 'UV Print — Klein',
    description: 'Volledige kleur UV Resin print met de Eufy make E1 — levensecht op elk plat oppervlak',
    unit: 'stuk',
    image: '/images/uv-print-klein.png',
    // Kostprijs: €0.50-1.50 substraat + €0.50-1.20 UV-inkt + ~10 min arbeid
    // Marge: 38-44%
    tiers: [
      { min: 1,   max: 25,       price: 5.50 },  // kostprijs ~€3.20
      { min: 26,  max: 50,       price: 4.50 },  // kostprijs ~€2.60
      { min: 51,  max: 99,       price: 3.75 },  // kostprijs ~€2.15
      { min: 100, max: Infinity, price: 3.00 }   // kostprijs ~€1.75
    ],
    selects: [
      { key: 'formaat',  label: 'Formaat',   options: ['5×5 cm', '8×8 cm', '10×10 cm'] },
      { key: 'materiaal',label: 'Materiaal', options: ['Acryl', 'Hout', 'Metaal', 'Kunststof'] }
    ],
    addons: [
      { key: 'glossy_lak', name: 'Glossy afwerklaag', price: 0.75, priceType: 'per_unit' }
    ]
  },
  'uv-print-medium': {
    name: 'UV Print — Groot',
    description: 'Grote formaten UV Resin print met de Eufy make E1 — ideaal voor displays en gifts',
    unit: 'stuk',
    image: null,
    // Kostprijs: €2-5 substraat + €2-4 UV-inkt (groter oppervlak) + ~20 min arbeid
    // Marge: 40-46%
    tiers: [
      { min: 1,   max: 25,       price: 12.50 }, // kostprijs ~€7.25
      { min: 26,  max: 50,       price: 10.50 }, // kostprijs ~€6.00
      { min: 51,  max: 99,       price: 8.75 },  // kostprijs ~€5.00
      { min: 100, max: Infinity, price: 7.25 }   // kostprijs ~€4.15
    ],
    selects: [
      { key: 'formaat',  label: 'Formaat',   options: ['15×15 cm', '20×15 cm', '20×20 cm'] },
      { key: 'materiaal',label: 'Materiaal', options: ['Acryl', 'Hout', 'Metaal', 'Glas', 'Kunststof'] }
    ],
    addons: [
      { key: 'glossy_lak',  name: 'Glossy afwerklaag',       price: 1.50, priceType: 'per_unit' },
      { key: 'staander',    name: 'Standaard/houder erbij',   price: 3.00, priceType: 'per_unit' }
    ]
  }
};

// ─── Cloudflare Turnstile verificatie ─────────────────────────────────────────

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Als er geen secret is geconfigureerd, skip verificatie (lokale dev)
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false, error: 'Geen CAPTCHA token ontvangen' };

  const body = new URLSearchParams({
    secret,
    response: token,
    ...(ip ? { remoteip: ip } : {})
  });

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    const data = await res.json();
    return data.success
      ? { success: true }
      : { success: false, error: 'CAPTCHA verificatie mislukt — probeer opnieuw' };
  } catch (err) {
    console.error('Turnstile verificatie fout:', err);
    return { success: false, error: 'CAPTCHA kon niet worden geverifieerd' };
  }
}

// ─── Hulpfuncties ──────────────────────────────────────────────────────────────

function getPricePerUnit(productKey, quantity) {
  const product = PRODUCTS[productKey];
  if (!product) return null;
  const tier = product.tiers.find(t => quantity >= t.min && quantity <= t.max);
  return tier ? tier.price : product.tiers[product.tiers.length - 1].price;
}

function calculateQuote(productKey, quantity, selectedAddons = [], isReturningCustomer = false) {
  const product = PRODUCTS[productKey];
  if (!product) return null;

  const qty = Math.max(1, parseInt(quantity) || 1);
  const pricePerUnit = getPricePerUnit(productKey, qty);
  const baseTotal = pricePerUnit * qty;

  let addonsTotal = 0;
  const addonsBreakdown = [];

  for (const addonKey of selectedAddons) {
    const addon = product.addons.find(a => a.key === addonKey);
    if (!addon) continue;
    const addonCost = addon.priceType === 'flat' ? addon.price : addon.price * qty;
    addonsTotal += addonCost;
    addonsBreakdown.push({
      key: addonKey,
      name: addon.name,
      priceType: addon.priceType,
      unitPrice: addon.price,
      total: addonCost
    });
  }

  // Setup/design kosten: eenmalig €25, alleen als product het vereist én klant is nieuw
  const productHasSetupFee = product.setupFee !== false;
  const setupFeeTotal = (productHasSetupFee && !isReturningCustomer) ? SETUP_FEE.price : 0;
  if (productHasSetupFee && !isReturningCustomer) {
    addonsBreakdown.unshift({
      key: SETUP_FEE.key,
      name: SETUP_FEE.name,
      priceType: SETUP_FEE.priceType,
      unitPrice: SETUP_FEE.price,
      total: SETUP_FEE.price
    });
    addonsTotal += setupFeeTotal;
  }

  const subtotal = baseTotal + addonsTotal;
  const btw = subtotal * 0.21;
  const total = subtotal + btw;

  // Bepaal volgende staffeltrap
  const currentTier = product.tiers.find(t => qty >= t.min && qty <= t.max);
  const currentTierIndex = product.tiers.indexOf(currentTier);
  const nextTier = product.tiers[currentTierIndex + 1] || null;

  return {
    product: { key: productKey, ...product },
    quantity: qty,
    pricePerUnit,
    baseTotal,
    addonsBreakdown,
    addonsTotal,
    subtotal,
    btw,
    total,
    nextTier: nextTier ? {
      atQuantity: nextTier.min,
      pricePerUnit: nextTier.price,
      saving: (pricePerUnit - nextTier.price) * nextTier.min
    } : null
  };
}

function generateQuoteNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `DDQ-${y}${m}${d}-${rand}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(date) {
  return date.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ─── API Routes ────────────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  const simplified = {};
  for (const [key, product] of Object.entries(PRODUCTS)) {
    simplified[key] = {
      name: product.name,
      description: product.description,
      unit: product.unit,
      image: product.image || null,
      setupFee: product.setupFee !== false,
      tiers: product.tiers,
      selects: product.selects,
      addons: product.addons
    };
  }
  res.json({ products: simplified });
});

app.post('/api/calculate', (req, res) => {
  const { product, quantity, addons, isReturningCustomer } = req.body;

  if (!product || !PRODUCTS[product]) {
    return res.status(400).json({ error: 'Ongeldig of ontbrekend product' });
  }
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Ongeldige hoeveelheid' });
  }

  const result = calculateQuote(product, quantity, addons || [], !!isReturningCustomer);
  res.json(result);
});

app.post('/api/quote/pdf', async (req, res) => {
  const {
    klantNaam, klantEmail, klantBedrijf, klantTelefoon, klantAdres,
    product, quantity, addons, selects, isReturningCustomer,
    opmerkingen, referentie, turnstileToken
  } = req.body;

  if (!klantNaam || !klantEmail || !product || !quantity) {
    return res.status(400).json({ error: 'Vereiste velden ontbreken' });
  }

  // Cloudflare Turnstile CAPTCHA verificatie
  const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
  const captcha = await verifyTurnstile(turnstileToken, clientIp);
  if (!captcha.success) {
    return res.status(403).json({ error: captcha.error });
  }

  const quote = calculateQuote(product, quantity, addons || [], !!isReturningCustomer);
  if (!quote) {
    return res.status(400).json({ error: 'Ongeldig product' });
  }

  const quoteNumber = generateQuoteNumber();
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);

  // Bedrijfsgegevens uit env of defaults
  const company = {
    name:    process.env.COMPANY_NAME    || 'DDDrukwerk',
    address: process.env.COMPANY_ADDRESS || 'Uw straatnaam 123',
    city:    process.env.COMPANY_CITY    || '1234 AB Amsterdam',
    phone:   process.env.COMPANY_PHONE   || '020-1234567',
    email:   process.env.COMPANY_EMAIL   || 'info@dddrukwerk.nl',
    website: process.env.COMPANY_WEBSITE || 'www.dddrukwerk.nl',
    kvk:     process.env.COMPANY_KVK     || '12345678',
    btw:     process.env.COMPANY_BTW     || 'NL123456789B01',
    iban:    process.env.COMPANY_IBAN    || 'NL12 ABCD 0123 4567 89'
  };

  try {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: {
        Title: `Offerte ${quoteNumber} - ${company.name}`,
        Author: company.name,
        Subject: `Offerte voor ${klantNaam}`,
        Creator: `${company.name} Offerte Systeem`
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Offerte-${quoteNumber}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');
    doc.pipe(res);

    // ── Kleurenpalet (DDDrukwerk huisstijl) ──
    const C = {
      primary:   '#C9A84C',  // Antiek goud
      secondary: '#0D0D0D',  // Diep zwart
      card:      '#1a1a1a',  // Card achtergrond
      champagne: '#F0D080',  // Champagne accent
      creme:     '#FAF3DC',  // Warm crème
      light:     '#F5F5F5',  // Licht tekst
      border:    '#C9A84C',  // Gouden border
      text:      '#1a1a1a',  // Donkere tekst (op lichte vlakken)
      muted:     '#666666',  // Muted tekst
      white:     '#FFFFFF'
    };

    const pageW = 595.28;
    const pageH = 841.89;
    const margin = 45;
    const contentW = pageW - margin * 2;

    // ── Header achtergrond ──
    doc.rect(0, 0, pageW, 140).fill(C.secondary);
    doc.rect(0, 130, pageW, 10).fill(C.primary);

    // ── Logo / Bedrijfsnaam ──
    doc.font('Helvetica-Bold').fontSize(30).fillColor(C.white)
       .text('DDDRUKWERK', margin, 38);

    doc.font('Helvetica').fontSize(9).fillColor(C.primary)
       .text('PREMIUM CUSTOM MERCHANDISE', margin, 76);

    doc.font('Helvetica').fontSize(8).fillColor('#888888')
       .text('Heemskerk, Nederland', margin, 90);

    // ── Contactinfo rechts in header ──
    const headerRight = pageW - margin;
    doc.font('Helvetica').fontSize(8.5).fillColor('#CCCCCC');
    const headerInfo = [
      company.phone,
      company.email,
      company.website
    ];
    headerInfo.forEach((line, i) => {
      doc.text(line, margin, 40 + i * 14, { width: contentW, align: 'right' });
    });

    // ── OFFERTE label ──
    doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
       .text('OFFERTE', pageW - margin - 80, 95, { width: 80, align: 'right' });

    // ── Quote info blok (rechts, onder header) ──
    const infoBoxX = pageW - margin - 200;
    const infoBoxY = 160;
    doc.rect(infoBoxX, infoBoxY, 200, 95).fillAndStroke(C.light, C.border);

    const infoItems = [
      ['Offertenummer', quoteNumber],
      ['Datum',         formatDate(today)],
      ['Geldig tot',    formatDate(validUntil)],
      ['Betaaltermijn', '14 dagen netto']
    ];
    infoItems.forEach(([label, value], i) => {
      const y = infoBoxY + 10 + i * 19;
      doc.font('Helvetica').fontSize(8).fillColor(C.muted).text(label, infoBoxX + 10, y);
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.text).text(value, infoBoxX + 90, y);
    });

    // ── Klantgegevens (links, onder header) ──
    doc.font('Helvetica-Bold').fontSize(9).fillColor(C.muted)
       .text('OFFERTE VOOR', margin, 165);
    doc.font('Helvetica-Bold').fontSize(13).fillColor(C.secondary)
       .text(klantNaam, margin, 180);

    if (klantBedrijf) {
      doc.font('Helvetica').fontSize(10).fillColor(C.text).text(klantBedrijf, margin, 197);
    }

    let klantY = klantBedrijf ? 213 : 200;
    if (klantAdres) {
      doc.font('Helvetica').fontSize(9).fillColor(C.muted).text(klantAdres, margin, klantY);
      klantY += 13;
    }
    doc.font('Helvetica').fontSize(9).fillColor(C.muted).text(klantEmail, margin, klantY);
    if (klantTelefoon) {
      doc.font('Helvetica').fontSize(9).fillColor(C.muted).text(klantTelefoon, margin, klantY + 13);
    }

    // ── Referentie ──
    if (referentie) {
      doc.font('Helvetica').fontSize(9).fillColor(C.muted)
         .text(`Uw referentie: ${referentie}`, margin, klantY + (klantTelefoon ? 26 : 13));
    }

    // ── Tabel header ──
    let tableY = 280;

    doc.rect(margin, tableY, contentW, 22).fill(C.secondary);
    const colX = [margin + 8, margin + 230, margin + 310, margin + 390, margin + 480];
    const colHeaders = ['Omschrijving', 'Aantal', 'Prijs/stuk', 'Subtotaal', 'Totaal'];
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.white);
    colHeaders.forEach((h, i) => {
      const align = i === 0 ? 'left' : 'right';
      const w = i === 0 ? 220 : 75;
      doc.text(h, colX[i], tableY + 7, { width: w, align });
    });

    tableY += 22;

    // ── Product rij ──
    // Bouw omschrijving op inclusief selects
    const selectsText = selects
      ? Object.entries(selects).map(([k, v]) => v).filter(Boolean).join(' · ')
      : '';
    const rowH = selectsText ? 48 : 38;
    doc.rect(margin, tableY, contentW, rowH).fillAndStroke(C.white, C.border);

    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.text)
       .text(quote.product.name, colX[0], tableY + 8, { width: 220 });
    doc.font('Helvetica').fontSize(8).fillColor(C.muted)
       .text(quote.product.description, colX[0], tableY + 22, { width: 220 });
    if (selectsText) {
      doc.font('Helvetica').fontSize(7.5).fillColor(C.primary)
         .text(selectsText, colX[0], tableY + 34, { width: 220 });
    }

    doc.font('Helvetica').fontSize(9.5).fillColor(C.text);
    doc.text(`${quote.quantity} ${quote.product.unit}`, colX[1], tableY + 13, { width: 75, align: 'right' });
    doc.text(formatCurrency(quote.pricePerUnit), colX[2], tableY + 13, { width: 75, align: 'right' });
    doc.text(formatCurrency(quote.baseTotal), colX[3], tableY + 13, { width: 75, align: 'right' });
    doc.text(formatCurrency(quote.baseTotal), colX[4], tableY + 13, { width: 75 - 8, align: 'right' });

    tableY += rowH;

    // ── Add-ons rijen ──
    quote.addonsBreakdown.forEach((addon, idx) => {
      const bg = idx % 2 === 0 ? '#FAFAFA' : C.white;
      doc.rect(margin, tableY, contentW, 26).fillAndStroke(bg, C.border);

      doc.font('Helvetica').fontSize(9).fillColor(C.text)
         .text(`+ ${addon.name}`, colX[0] + 8, tableY + 8, { width: 210 });

      if (addon.priceType === 'flat') {
        doc.font('Helvetica').fontSize(8.5).fillColor(C.muted)
           .text('vast bedrag', colX[1], tableY + 9, { width: 75, align: 'right' });
        doc.text('—', colX[2], tableY + 9, { width: 75, align: 'right' });
      } else {
        doc.font('Helvetica').fontSize(8.5).fillColor(C.muted);
        doc.text(`${quote.quantity}×`, colX[1], tableY + 9, { width: 75, align: 'right' });
        doc.text(formatCurrency(addon.unitPrice), colX[2], tableY + 9, { width: 75, align: 'right' });
      }
      doc.font('Helvetica').fontSize(8.5).fillColor(C.text)
         .text(formatCurrency(addon.total), colX[3], tableY + 9, { width: 75, align: 'right' });
      doc.text(formatCurrency(addon.total), colX[4], tableY + 9, { width: 75 - 8, align: 'right' });

      tableY += 26;
    });

    // ── Totaalblok ──
    tableY += 8;

    const totaalItems = [
      ['Subtotaal (excl. BTW)',  formatCurrency(quote.subtotal), false],
      ['BTW 21%',                formatCurrency(quote.btw),      false],
      ['TOTAAL (incl. BTW)',     formatCurrency(quote.total),    true]
    ];

    totaalItems.forEach(([label, value, bold]) => {
      const h = bold ? 26 : 20;
      if (bold) {
        doc.rect(margin + contentW - 250, tableY, 250, h).fill(C.primary);
        doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white);
        doc.text(label, margin + contentW - 245, tableY + 7, { width: 130 });
        doc.text(value, margin + contentW - 110, tableY + 7, { width: 100, align: 'right' });
      } else {
        doc.rect(margin + contentW - 250, tableY, 250, h).fillAndStroke(C.light, C.border);
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).fillColor(C.text);
        doc.text(label, margin + contentW - 245, tableY + 5, { width: 130 });
        doc.text(value, margin + contentW - 110, tableY + 5, { width: 100, align: 'right' });
      }
      tableY += h;
    });

    // ── Staffelkorting tip ──
    if (quote.nextTier) {
      tableY += 15;
      doc.rect(margin, tableY, contentW - 255, 38).fillAndStroke('#FFF8E1', '#F59E0B');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#92400E')
         .text('TIP: Bestel meer, betaal minder!', margin + 8, tableY + 6);
      doc.font('Helvetica').fontSize(8).fillColor('#92400E')
         .text(
           `Vanaf ${quote.nextTier.atQuantity} stuks betaalt u slechts ${formatCurrency(quote.nextTier.pricePerUnit)}/stuk. Bespaar ca. ${formatCurrency(quote.nextTier.saving)}!`,
           margin + 8, tableY + 18, { width: contentW - 275 }
         );
    }

    // ── Opmerkingen ──
    if (opmerkingen) {
      tableY += 55;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(C.secondary).text('Opmerkingen', margin, tableY);
      doc.rect(margin, tableY + 14, contentW, 1).fill(C.border);
      doc.font('Helvetica').fontSize(9).fillColor(C.text)
         .text(opmerkingen, margin, tableY + 20, { width: contentW });
    }

    // ── Footer ──
    const footerY = pageH - 80;
    doc.rect(0, footerY, pageW, 1).fill(C.border);
    doc.rect(0, footerY + 1, pageW, 79).fill(C.light);

    // Bankgegevens
    doc.font('Helvetica-Bold').fontSize(8).fillColor(C.secondary).text('Bankgegevens', margin, footerY + 12);
    doc.font('Helvetica').fontSize(8).fillColor(C.muted)
       .text(`IBAN: ${company.iban}`, margin, footerY + 24)
       .text(`o.v.v. offertenummer ${quoteNumber}`, margin, footerY + 36);

    // KvK / BTW
    doc.font('Helvetica-Bold').fontSize(8).fillColor(C.secondary)
       .text('Bedrijfsgegevens', pageW / 2 - 40, footerY + 12);
    doc.font('Helvetica').fontSize(8).fillColor(C.muted)
       .text(`KvK: ${company.kvk}`, pageW / 2 - 40, footerY + 24)
       .text(`BTW: ${company.btw}`, pageW / 2 - 40, footerY + 36);

    // Voorwaarden
    doc.font('Helvetica').fontSize(7.5).fillColor(C.muted)
       .text(
         `Op alle offertes en overeenkomsten zijn de Algemene Leveringsvoorwaarden van ${company.name} van toepassing.`,
         margin, footerY + 56, { width: contentW, align: 'center' }
       );

    // Rode accent streep onderkant
    doc.rect(0, pageH - 6, pageW, 6).fill(C.primary);

    doc.end();
  } catch (err) {
    console.error('PDF generatie fout:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'PDF generatie mislukt', detail: err.message });
    }
  }
});

// ─── Statische bestanden fallback ─────────────────────────────────────────────

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Server starten (lokale dev) ──────────────────────────────────────────────

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`DDDrukwerk Offerte Generator draait op http://localhost:${PORT}`);
  });
}

module.exports = app;
