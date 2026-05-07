require('dotenv').config();
const express = require('express');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Productcatalogus met staffelprijzen ───────────────────────────────────────

const PRODUCTS = {
  sleutelhanger: {
    name: 'Sleutelhanger',
    category: 'Accessoires',
    description: 'Gegraveerde aluminium sleutelhangers op maat',
    unit: 'stuk',
    minOrder: 10,
    tiers: [
      { min: 1,    max: 9,        price: 2.45 },
      { min: 10,   max: 24,       price: 1.85 },
      { min: 25,   max: 49,       price: 1.45 },
      { min: 50,   max: 99,       price: 1.20 },
      { min: 100,  max: 249,      price: 0.95 },
      { min: 250,  max: 499,      price: 0.75 },
      { min: 500,  max: 999,      price: 0.60 },
      { min: 1000, max: Infinity, price: 0.48 }
    ]
  },
  naamplaatje: {
    name: 'Naamplaatje',
    category: 'Identificatie',
    description: 'Gegraveerde naamplaatjes in aluminium of messing',
    unit: 'stuk',
    minOrder: 5,
    tiers: [
      { min: 1,   max: 9,        price: 3.50 },
      { min: 10,  max: 24,       price: 2.65 },
      { min: 25,  max: 49,       price: 2.15 },
      { min: 50,  max: 99,       price: 1.75 },
      { min: 100, max: 249,      price: 1.40 },
      { min: 250, max: 499,      price: 1.10 },
      { min: 500, max: Infinity, price: 0.90 }
    ]
  },
  button_badge: {
    name: 'Button / Badge',
    category: 'Promotie',
    description: 'Full-colour buttons en badges met eigen design',
    unit: 'stuk',
    minOrder: 25,
    tiers: [
      { min: 1,    max: 24,       price: 1.75 },
      { min: 25,   max: 49,       price: 1.30 },
      { min: 50,   max: 99,       price: 1.00 },
      { min: 100,  max: 249,      price: 0.78 },
      { min: 250,  max: 499,      price: 0.60 },
      { min: 500,  max: 999,      price: 0.46 },
      { min: 1000, max: Infinity, price: 0.35 }
    ]
  },
  magneet: {
    name: 'Koelkastmagneet',
    category: 'Promotie',
    description: 'Full-colour koelkastmagneten op maat',
    unit: 'stuk',
    minOrder: 25,
    tiers: [
      { min: 1,   max: 24,       price: 2.20 },
      { min: 25,  max: 49,       price: 1.70 },
      { min: 50,  max: 99,       price: 1.35 },
      { min: 100, max: 249,      price: 1.05 },
      { min: 250, max: 499,      price: 0.82 },
      { min: 500, max: Infinity, price: 0.62 }
    ]
  },
  sticker_vel: {
    name: 'Stickervellen',
    category: 'Stickers',
    description: 'Gepersonaliseerde stickervellen (A4, keuze uit glans/mat)',
    unit: 'vel',
    minOrder: 10,
    tiers: [
      { min: 1,   max: 9,        price: 2.95 },
      { min: 10,  max: 24,       price: 2.20 },
      { min: 25,  max: 49,       price: 1.75 },
      { min: 50,  max: 99,       price: 1.40 },
      { min: 100, max: 249,      price: 1.10 },
      { min: 250, max: Infinity, price: 0.85 }
    ]
  },
  sticker_los: {
    name: 'Losse Stickers',
    category: 'Stickers',
    description: 'Individuele stickers op maat (uw eigen vorm/maat)',
    unit: 'stuk',
    minOrder: 50,
    tiers: [
      { min: 1,    max: 49,       price: 0.95 },
      { min: 50,   max: 99,       price: 0.65 },
      { min: 100,  max: 249,      price: 0.48 },
      { min: 250,  max: 499,      price: 0.35 },
      { min: 500,  max: 999,      price: 0.26 },
      { min: 1000, max: Infinity, price: 0.18 }
    ]
  },
  visitekaartje: {
    name: 'Visitekaartje',
    category: 'Drukwerk',
    description: 'Full-colour visitekaartjes, 350gr. glanscoating',
    unit: 'stuk',
    minOrder: 100,
    tiers: [
      { min: 1,    max: 99,       price: 0.45 },
      { min: 100,  max: 249,      price: 0.28 },
      { min: 250,  max: 499,      price: 0.18 },
      { min: 500,  max: 999,      price: 0.12 },
      { min: 1000, max: 2499,     price: 0.08 },
      { min: 2500, max: Infinity, price: 0.06 }
    ]
  }
};

const ADDONS = {
  ring:         { name: 'Splitring',               priceType: 'per_unit', price: 0.12 },
  karabijn:     { name: 'Karabijnhaak',            priceType: 'per_unit', price: 0.22 },
  dubbelzijdig: { name: 'Dubbelzijdig bedrukt',    priceType: 'per_unit', price: 0.28 },
  pms_kleur:    { name: 'PMS / Pantone kleur',     priceType: 'per_unit', price: 0.18 },
  cadeau_verpakking: { name: 'Cadeauverpakking',   priceType: 'per_unit', price: 0.65 },
  glans_laminaat:    { name: 'Glans laminaat',     priceType: 'per_unit', price: 0.10 },
  mat_laminaat:      { name: 'Mat laminaat',       priceType: 'per_unit', price: 0.10 },
  express_48u:  { name: 'Express levering 48u',    priceType: 'flat',     price: 45.00 },
  express_24u:  { name: 'Express levering 24u',    priceType: 'flat',     price: 75.00 },
  ontwerp:      { name: 'Ontwerp service',         priceType: 'flat',     price: 85.00 }
};

// ─── Hulpfuncties ──────────────────────────────────────────────────────────────

function getPricePerUnit(productKey, quantity) {
  const product = PRODUCTS[productKey];
  if (!product) return null;
  const tier = product.tiers.find(t => quantity >= t.min && quantity <= t.max);
  return tier ? tier.price : product.tiers[product.tiers.length - 1].price;
}

function calculateQuote(productKey, quantity, selectedAddons = []) {
  const product = PRODUCTS[productKey];
  if (!product) return null;

  const qty = Math.max(1, parseInt(quantity) || 1);
  const pricePerUnit = getPricePerUnit(productKey, qty);
  const baseTotal = pricePerUnit * qty;

  let addonsTotal = 0;
  const addonsBreakdown = [];

  for (const addonKey of selectedAddons) {
    const addon = ADDONS[addonKey];
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
      category: product.category,
      description: product.description,
      unit: product.unit,
      minOrder: product.minOrder,
      tiers: product.tiers
    };
  }
  res.json({ products: simplified, addons: ADDONS });
});

app.post('/api/calculate', (req, res) => {
  const { product, quantity, addons } = req.body;

  if (!product || !PRODUCTS[product]) {
    return res.status(400).json({ error: 'Ongeldig of ontbrekend product' });
  }
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Ongeldige hoeveelheid' });
  }

  const result = calculateQuote(product, quantity, addons || []);
  res.json(result);
});

app.post('/api/quote/pdf', async (req, res) => {
  const {
    klantNaam, klantEmail, klantBedrijf, klantTelefoon, klantAdres,
    product, quantity, addons, opmerkingen, referentie
  } = req.body;

  if (!klantNaam || !klantEmail || !product || !quantity) {
    return res.status(400).json({ error: 'Vereiste velden ontbreken' });
  }

  const quote = calculateQuote(product, quantity, addons || []);
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

    // ── Kleurenpalet ──
    const C = {
      primary:   '#D62828',  // DDDrukwerk rood
      secondary: '#1A1A2E',  // Donker navy
      accent:    '#F77F00',  // Oranje accent
      light:     '#F8F8F8',  // Licht grijs
      border:    '#E0E0E0',  // Border kleur
      text:      '#2D2D2D',  // Hoofdtekst
      muted:     '#6B7280',  // Muted tekst
      white:     '#FFFFFF'
    };

    const pageW = 595.28;
    const pageH = 841.89;
    const margin = 45;
    const contentW = pageW - margin * 2;

    // ── Header achtergrond ──
    doc.rect(0, 0, pageW, 140).fill(C.secondary);
    doc.rect(0, 130, pageW, 12).fill(C.primary);

    // ── Logo / Bedrijfsnaam ──
    doc.font('Helvetica-Bold').fontSize(32).fillColor(C.white)
       .text('DDD', margin, 35, { continued: true })
       .font('Helvetica').fontSize(32).fillColor(C.primary)
       .text('drukwerk', { lineBreak: false });

    doc.font('Helvetica').fontSize(10).fillColor('#AAAAAA')
       .text('Gepersonaliseerd drukwerk op maat', margin, 75);

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
    const rowH = 38;
    doc.rect(margin, tableY, contentW, rowH).fillAndStroke(C.white, C.border);

    doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.text)
       .text(quote.product.name, colX[0], tableY + 8, { width: 220 });
    doc.font('Helvetica').fontSize(8).fillColor(C.muted)
       .text(quote.product.description, colX[0], tableY + 22, { width: 220 });

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
