# Atelier & Artifact — Luxury E-Commerce Storefront

An end-to-end, high-performance luxury e-commerce application built with **Next.js 15 (App Router)**, **Sanity.io (Headless CMS)**, and **Tailwind CSS**. Designed for curated artifact collection, responsive showcase, dynamic categories, and frictionless checkout integration.

---

## 🌟 Key Features

* **Dynamic Headless CMS**: Powered by Sanity v3 using GROQ queries for structured data retrieval.
* **Resilient Image Handling**: Seamless fallback pipeline supporting both native Sanity asset references (`cdn.sanity.io`) and external CDN URLs (`images.unsplash.com`).
* **Next.js 15 App Router Architecture**: Uses Server Components, React 19 standards, and async route params handling.
* **Unoptimized Image Bypass**: Pre-configured `next.config.mjs` domain patterns to eliminate external asset host constraints.
* **Curated Catalog Browsing**: Dynamic product sorting by featured status and category filtering.
* **Automated Data Pipelines**: Includes custom PowerShell tooling for bulk deletion, dataset generation (`.ndjson`), and database seeding.

---

## 🏗️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **CMS**: [Sanity.io](https://www.sanity.io/) (GROQ Query Language)
* **Icons & Fonts**: Google Fonts (Serif typography), Lucide / Custom SVG Icons
* **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Directory Structure

```text
atelier_artifact/
├── app/
│   ├── api/                  # API endpoints (Checkout, webhooks)
│   ├── product/
│   │   └── [slug]/
│   │       └── page.jsx      # Dynamic product detail pages (Next.js 15 async params)
│   ├── shop/
│   │   └── page.jsx          # Catalog filter page
│   ├── globals.css           # Custom styles & Tailwind imports
│   ├── layout.jsx            # Root layout component
│   └── page.jsx              # Homepage (Hero, Categories, Featured Artifacts)
├── components/
│   ├── CheckoutButton.jsx    # Store checkout integration
│   ├── Footer.jsx            # Sitewide footer
│   ├── Navbar.jsx            # Navigation bar
│   └── ProductCard.jsx       # Reusable product card
├── lib/
│   ├── sanity.js             # Sanity client initialization & image builder helper
│   └── sanity.queries.js     # Centralized GROQ query functions
├── schemas/
│   ├── category.js           # Category document schema definition
│   ├── product.js            # Product document schema definition
│   └── index.js              # Combined Sanity schema exports
├── public/                   # Static assets & placeholders
├── products.ndjson           # Clean dataset seed file
├── store.config.json         # Store branding, trust badges, and copy configurations
├── next.config.mjs           # Next.js configuration & remote image patterns
└── package.json
````
🚀 Getting Started
1. Prerequisites
Make sure you have installed:

Node.js (v18.17 or higher)

Sanity CLI (npm install -g @sanity/cli)

Git

2. Environment Setup
Create a .env.local file in the root directory and define your Sanity configuration variables:

Code snippet
NEXT_PUBLIC_SANITY_PROJECT_ID=1i0crqay
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-08-15
3. Install Dependencies
Bash
npm install
🗄️ Database & Dataset Management
Resetting and Seeding the Sanity Dataset
Sanity enforces strict referential integrity between referenced entities. To clean and seed your dataset with products.ndjson:

Option A: Clean and Import (PowerShell)
PowerShell
# 1. Delete dependent products first
$prodIds = (sanity documents query "*[_type == 'product']._id" --dataset production --project-id 1i0crqay | ConvertFrom-Json)
$prodIds | ForEach-Object { sanity documents delete $_ --dataset production --project-id 1i0crqay }

# 2. Delete categories
$catIds = (sanity documents query "*[_type == 'category']._id" --dataset production --project-id 1i0crqay | ConvertFrom-Json)
$catIds | ForEach-Object { sanity documents delete $_ --dataset production --project-id 1i0crqay }

# 3. Import clean dataset with overwrite flag
sanity dataset import products.ndjson --dataset production --project-id 1i0crqay --replace
💻 Local Development
Run the development server:

Bash
# Clear previous Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

#  Start dev server
npm run dev
Open http://localhost:3000 in your browser to view the application.

☁️ Deployment
Deploy to Vercel
Push your latest code changes to Git:

Bash
git add .
git commit -m "Prepare production release"
git push origin main
Trigger Vercel Deployment:

Bash
vercel --prod
Ensure Environment Variables are configured in the Vercel Dashboard under Project Settings -> Environment Variables:

NEXT_PUBLIC_SANITY_PROJECT_ID

NEXT_PUBLIC_SANITY_DATASET

NEXT_PUBLIC_SANITY_API_VERSION
