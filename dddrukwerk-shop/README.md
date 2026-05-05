# DDDrukwerk E-Commerce Webshop

Premium custom merchandise webshop built with Next.js, React, and Tailwind CSS.

## Features

- ✅ Product showcase (Keychains + UV Prints)
- ✅ Customizable products (material, size, add-ons)
- ✅ Shopping cart management
- ✅ Checkout form with Mollie payment integration ready
- ✅ Responsive design (mobile-first)
- ✅ DDDrukwerk brand styling (black/gold theme)
- ✅ TypeScript for type safety

## Quick Start

### Prerequisites
- Node.js 16+ (download from https://nodejs.org/)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dddrukwerk-shop/
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── ProductShowcase.tsx # Product grid + customizer
│   ├── Cart.tsx           # Shopping cart & checkout
│   ├── Footer.tsx         # Footer
│   └── *.module.css       # Component styles
├── package.json
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
└── .env.local.example     # Environment template
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy (automatic)

[Learn more →](./DEPLOYMENT.md)

## Mollie Payment Integration

To enable real payments:

1. Create account at https://www.mollie.com/nl
2. Get your API key from Settings → API keys
3. Create `.env.local`:
   ```
   MOLLIE_API_KEY=live_xxxxxxxxxxxxx
   NEXT_PUBLIC_APP_URL=https://dddrukwerk.nl
   ```
4. Implement backend endpoint (see DEPLOYMENT.md)

## Technologies

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** CSS Modules
- **State:** React Hooks
- **Payment:** Mollie (optional)
- **Hosting:** Vercel (recommended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2026 DDDrukwerk. All rights reserved.

## Support

See [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting and detailed setup instructions.
