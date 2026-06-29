# Character Artist Portfolio — Full-Stack MERN Build Prompt

---

## 🧠 PROJECT OVERVIEW

Build a **cinematic, fully dynamic character artist portfolio website** — a MERN stack web application that functions as both a **personal brand showcase** and a **freelance client acquisition platform**. Think ArtStation if it were redesigned by the studios behind GTA VI and lenis.dev: immersive, scroll-driven, visually theatrical, and dripping with personality.

The site must feel **alive at every scroll tick** — no dead zones, no static layouts, nothing that sits still when it shouldn't. Every section breathes. The artist uploads their work through an admin panel; the world sees a living gallery that evolves in real time.

---

## 🎨 DESIGN LANGUAGE & VISUAL DIRECTION

### References
- **lenis.dev** — Typographic boldness, large kinetic text, scroll-synced reveals, ink-black backgrounds with sharp accent cuts, industrial editorial rhythm, heavy use of horizontal rules and counter-intuitive whitespace
- **rockstargames.com/VI** — Cinematic hero sections with full-bleed video/image parallax, character spotlight storytelling with scroll-triggered transitions, premium dark aesthetic, dramatic typography scaling, layered atmospheric depth, immersive fullscreen sections that unfold as you scroll

### Aesthetic Direction: **"Dark Forge"**
- **Color palette**: Near-black `#0A0A0A` base, off-white `#F0EDE6` text, electric amber `#FF6B1A` as primary accent, deep crimson `#C1121F` as secondary accent, muted gold `#B89A5E` for decorative elements
- **Typography**: Pair a heavy serif display font (e.g., **Playfair Display Black** or **Freight Display**) for hero headings with a tight grotesque (e.g., **Neue Haas Grotesk** or **DM Sans**) for body. Use enormous typographic scale (vw-based) for section labels. Number counters (01, 02...) styled like editorial magazine spreads
- **Motion philosophy**: Everything enters via scroll. Use **Lenis** for buttery smooth scrolling + **GSAP ScrollTrigger** for orchestrated reveals. Hero section uses **parallax depth layers** (foreground character art moves faster than background). Text splits into characters/words and animates in. Images clip-reveal from bottom. No CSS transitions that feel like Bootstrap
- **Atmosphere**: Grain overlay across entire site (SVG filter or canvas-based). Subtle vignette on sections. Noise texture on cards. Custom cursor (crosshair that morphs on hover over artwork). Dark glow/bloom on accent color elements
- **Layout**: Brutalist-magazine hybrid. Asymmetric grids. Overlapping text on images. Full-viewport sections that snap/pin. Horizontal scroll galleries inside vertical page flow. Grid-breaking pull quotes from client testimonials

---

## 🗂️ FULL FEATURE SPECIFICATION

### PUBLIC-FACING SITE

#### 1. Hero / Landing Section
- Full-viewport cinematic entry — dark, atmospheric, character art as background with parallax depth (2–3 layers at different scroll speeds using GSAP)
- Artist name rendered in **massive display type** that animates in character-by-character on load
- Subtitle line (e.g., "Character Artist · Concept · 3D Sculpt") types in after with a cursor blink
- Ambient floating particles or dust effect (canvas-based, subtle)
- Custom animated scroll indicator ("scroll to explore" with animated arrow or line)
- All content is **CMS-driven** — admin can change background art, name display, subtitle

#### 2. About / Identity Section
- Two-column layout: large portrait/self-render on left (parallax), editorial bio text on right
- Bio text **pinned and revealed** as user scrolls through the section
- Skill tags animate in as horizontal pills
- "Years of Experience" and "Projects Completed" — animated odometer-style number counters that trigger on scroll entry
- Admin can edit: portrait image, bio text, skill tags, counter values

#### 3. Skills & Expertise Section
- Visual skill matrix — not boring bars, but **circular progress rings** or **animated mesh cards** per skill category:
  - Character Sculpting, Texturing / Substance, Rigging, Concept Art, ZBrush, Maya/Blender, Unreal Engine, etc.
- Each skill card has an icon, name, and proficiency level (set by admin)
- Cards stagger in on scroll
- Section title animates in split-word style

#### 4. Portfolio / Works Gallery (Core Section)
- **Filterable masonry grid** with categories: All, Characters, Creatures, Environments, Concepts, Fan Art, Game-Ready Assets
- Each artwork card:
  - On hover: smooth scale + grain darkens + title/category fades up from bottom
  - Custom cursor changes to eye icon
- Click → **Full lightbox modal**: immersive fullscreen view with:
  - Project title, category, year, description
  - Multiple images carousel (before/after sculpt, wireframe, final render)
  - Optional: embedded 3D model viewer (Three.js / Sketchfab embed)
  - Tags (engine used, poly count, software)
  - Next/Prev project navigation
- Works data is **100% CMS-driven** from MongoDB via admin panel

#### 5. Featured / Spotlight Section
- **Horizontal scroll section** (pinned via GSAP) — 3–5 "hero project" cards that scroll sideways as user scrolls down
- Each featured card is fullscreen width, cinematic, shows:
  - Large character render
  - Project name in oversized type
  - Short teaser description
  - "View Project" CTA
- Admin marks which portfolio items are "Featured"

#### 6. Process / How I Work Section
- Timeline-style numbered steps (01 → 06) for artist workflow:
  - Brief & Research → Concept Sketching → Base Mesh → Sculpt & Detail → Texturing → Final Render/Delivery
- Each step animates in on scroll with a connecting line that draws itself (SVG stroke animation)
- Admin can edit step titles and descriptions

#### 7. Testimonials / Client Words Section
- Full-bleed dark section with large pull-quote typography
- Auto-rotating carousel with client name, company, and avatar
- Quote text scales huge, almost typographic art
- Admin can add/edit/delete testimonials from panel

#### 8. Services / What I Offer Section
- Cards for each service type:
  - Game-Ready Character (poly budget, textures, rigging)
  - Concept Art & Illustration
  - Creature Design
  - Stylized / Realistic Characters
  - Fan Art Commissions
- Each card has: service name, short description, starting price (optional), CTA
- Admin can toggle services visible/hidden, edit content and pricing

#### 9. Contact Section
- **Dual-mode contact**:
  - **Quick Inquiry Form** → sends email via Nodemailer (to artist's Gmail/custom email)
  - **Book a Project Form** → more detailed (project type, budget range, deadline, reference links)
- Form fields animate in on scroll with floating label inputs (glassmorphism-lite style)
- On submit: animated success state (character art or particle burst)
- Social links: ArtStation, Instagram, Twitter/X, LinkedIn, Behance — all icon-animated
- Admin can configure: receiving email address, auto-reply message content

#### 10. Footer
- Minimal dark footer with large typographic artist name
- Navigation links, social icons
- "Available for work" status badge (green dot, toggleable by admin)
- Copyright line

---

### ADMIN PANEL (`/admin`)

**Authentication**: JWT-based login. Single admin user. Token stored in httpOnly cookie. Protected routes via middleware.

#### Admin Dashboard
- Overview stats: Total artworks, Featured count, Messages received (unread badge), Services active
- Quick action buttons: Add Artwork, View Messages, Edit Hero

#### Content Management Modules:

**Hero Manager**
- Edit artist name, subtitle/tagline
- Upload/replace hero background image or video
- Preview changes live (iframe or redirect)

**About Manager**
- Rich text editor (Quill or TipTap) for bio
- Upload artist portrait
- Edit skill tags (add/remove pills)
- Set counter values (years, projects, clients)

**Portfolio Manager**
- Add new artwork:
  - Title, category (dropdown), description, tags, year
  - Multiple image upload (drag & drop, reorder, set primary)
  - Sketchfab/Three.js model embed URL (optional)
  - Software used, engine, poly count
  - Toggle: Featured (yes/no), Published (yes/no)
- Edit / Delete existing artworks
- Drag-to-reorder artworks
- Bulk category assign

**Skills Manager**
- Add/edit/delete skill items
- Set skill name, icon (upload or emoji), proficiency (0–100)
- Reorder via drag

**Services Manager**
- Toggle services visible/hidden
- Edit service name, description, price label
- Add new service types

**Testimonials Manager**
- Add/edit/delete testimonials
- Fields: quote, client name, company, avatar upload, rating (1–5)

**Messages Inbox**
- View all contact form submissions
- Mark as read / delete
- Quick reply button (opens email client or inline reply via Nodemailer)
- Filter: All / Unread / Project Inquiries / Quick Messages

**Settings**
- Contact email for Nodemailer delivery
- Auto-reply message body (rich text)
- "Available for work" toggle (shows/hides badge on site)
- Site meta (SEO title, description, OG image)

---

## 🏗️ TECHNICAL ARCHITECTURE

### MERN Stack

#### Frontend — React (Vite)
```
src/
├── assets/              # Static SVGs, fonts, grain texture
├── components/
│   ├── ui/              # Button, Input, Modal, Loader, Badge
│   ├── layout/          # Navbar, Footer, PageWrapper
│   ├── sections/        # Hero, About, Gallery, Contact, etc.
│   └── admin/           # Sidebar, DataTable, ImageUploader, RichText
├── hooks/               # useScrollTrigger, useLenis, useMediaQuery, useAuth
├── context/             # AuthContext, ThemeContext
├── pages/
│   ├── public/          # Home, ProjectDetail
│   └── admin/           # Dashboard, Portfolio, Messages, Settings, Login
├── services/            # api.js (Axios instance), auth.service.js
├── utils/               # formatDate, cn (classnames), validators
├── animations/          # gsap.config.js, splitText.js, parallax.js
├── router/              # AppRouter.jsx, ProtectedRoute.jsx
└── styles/              # globals.css, variables.css, typography.css
```

**Key packages:**
- `@studio-freight/lenis` — smooth scroll engine
- `gsap` + `@gsap/react` + `ScrollTrigger` plugin — all scroll animations
- `three` / `@react-three/fiber` — optional 3D model viewer in lightbox
- `framer-motion` — micro-interactions and page transitions (complements GSAP)
- `react-query` (@tanstack/react-query) — server state, caching, refetch
- `axios` — HTTP client with interceptors
- `react-hot-toast` — notification system
- `react-dropzone` — drag & drop image uploads in admin
- `@tiptap/react` — rich text editor in admin
- `react-router-dom` v6 — routing

**Performance:**
- Lazy load all page sections via `React.lazy` + `Suspense`
- Images served via Cloudinary (transformation API for WebP, responsive sizes)
- Intersection Observer for progressive loading of gallery items
- Fonts preloaded in `<head>`; display: swap
- Vite bundle splitting: vendor / animations / admin chunks separate

**Deployment: Vercel**
- `vercel.json` with rewrite rules for SPA routing
- Environment variables: `VITE_API_URL`, `VITE_CLOUDINARY_CLOUD_NAME`

---

#### Backend — Node.js + Express (Modular Monolith)

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── portfolio/
│   │   │   ├── portfolio.controller.js
│   │   │   ├── portfolio.service.js
│   │   │   ├── portfolio.routes.js
│   │   │   ├── portfolio.model.js
│   │   │   └── portfolio.validation.js
│   │   ├── about/
│   │   │   ├── about.controller.js
│   │   │   ├── about.service.js
│   │   │   ├── about.routes.js
│   │   │   └── about.model.js
│   │   ├── hero/
│   │   ├── skills/
│   │   ├── services/
│   │   ├── testimonials/
│   │   ├── contact/
│   │   │   ├── contact.controller.js
│   │   │   ├── contact.service.js   ← Nodemailer lives here
│   │   │   ├── contact.routes.js
│   │   │   └── contact.model.js
│   │   └── settings/
│   ├── middleware/
│   │   ├── auth.middleware.js       ← JWT verify
│   │   ├── upload.middleware.js     ← Multer + Cloudinary
│   │   ├── validate.middleware.js   ← Joi/Zod schema validation
│   │   ├── rateLimit.middleware.js  ← express-rate-limit on contact form
│   │   └── errorHandler.middleware.js
│   ├── config/
│   │   ├── db.js                    ← Mongoose connect
│   │   ├── cloudinary.js            ← Cloudinary SDK init
│   │   ├── nodemailer.js            ← Transporter factory
│   │   └── env.js                  ← dotenv + validation
│   ├── utils/
│   │   ├── ApiResponse.js
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   └── app.js                       ← Express app, middleware chain, route mount
├── server.js                        ← Entry point, listen
├── .env.example
└── package.json
```

**API Design (REST)**

All public endpoints: `GET /api/v1/...`
All protected endpoints: `POST/PUT/DELETE /api/v1/admin/...` (require Bearer JWT)

```
Auth
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout
  GET    /api/v1/auth/me

Hero
  GET    /api/v1/hero
  PUT    /api/v1/admin/hero

About
  GET    /api/v1/about
  PUT    /api/v1/admin/about

Portfolio
  GET    /api/v1/portfolio              ?category=&featured=&page=&limit=
  GET    /api/v1/portfolio/:slug
  POST   /api/v1/admin/portfolio
  PUT    /api/v1/admin/portfolio/:id
  DELETE /api/v1/admin/portfolio/:id
  PATCH  /api/v1/admin/portfolio/reorder

Skills
  GET    /api/v1/skills
  POST   /api/v1/admin/skills
  PUT    /api/v1/admin/skills/:id
  DELETE /api/v1/admin/skills/:id

Services
  GET    /api/v1/services
  POST   /api/v1/admin/services
  PUT    /api/v1/admin/services/:id
  DELETE /api/v1/admin/services/:id

Testimonials
  GET    /api/v1/testimonials
  POST   /api/v1/admin/testimonials
  PUT    /api/v1/admin/testimonials/:id
  DELETE /api/v1/admin/testimonials/:id

Contact
  POST   /api/v1/contact              ← Public, rate-limited, sends email via Nodemailer

Messages (Admin Inbox)
  GET    /api/v1/admin/messages        ?read=&type=
  PATCH  /api/v1/admin/messages/:id/read
  DELETE /api/v1/admin/messages/:id

Settings
  GET    /api/v1/settings             ← Public (for meta, availability status)
  PUT    /api/v1/admin/settings
```

**Key packages:**
- `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`
- `jsonwebtoken`, `bcryptjs`
- `multer`, `cloudinary`, `multer-storage-cloudinary`
- `nodemailer`
- `express-rate-limit`
- `zod` or `joi` for validation
- `express-async-errors`

**Deployment: Render (or Vercel Serverless)**
- If Render: standard Node server, `Procfile` or `start` script
- If Vercel: wrap Express in `api/index.js` with `vercel.json` rewrites
- MongoDB Atlas for database
- Cloudinary for all media storage (images uploaded to Cloudinary, only URLs stored in DB)

---

## 📧 NODEMAILER EMAIL SYSTEM

**Two email triggers:**

1. **New Contact/Project Inquiry** → sends to artist's configured email:
   - Subject: `[New Inquiry] {subject from form}`
   - Body: name, email, message, project type, budget (HTML email template, styled)

2. **Auto-reply to client** → sent immediately on form submit:
   - Subject: `Got your message — {ArtistName} will be in touch`
   - Body: Admin-configurable message body (fetched from Settings collection)
   - Branded HTML template with artist logo/name

**Implementation:**
- Transporter created with SMTP credentials (Gmail app password or SendGrid SMTP)
- Credentials stored in env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- HTML email templates stored as template literals or `.hbs` files
- Rate limiting on `/api/v1/contact`: max 3 requests per IP per 15 minutes

---

## 🗃️ MONGODB SCHEMAS (Key ones)

```js
// PortfolioItem
{
  title: String,
  slug: String,          // auto-generated from title
  category: Enum['characters','creatures','environments','concepts','fanart','game-ready'],
  description: String,
  images: [{ url: String, publicId: String, isPrimary: Boolean, order: Number }],
  modelEmbedUrl: String, // Sketchfab or Three.js model
  tags: [String],
  software: [String],
  year: Number,
  polyCount: String,
  engine: String,
  isFeatured: Boolean,
  isPublished: Boolean,
  order: Number,         // for manual sort
  createdAt, updatedAt
}

// ContactMessage
{
  name, email, subject, message,
  type: Enum['quick','project'],
  projectType, budget, deadline,
  isRead: Boolean,
  createdAt
}

// Settings (single document)
{
  contactEmail: String,
  autoReplyBody: String,
  isAvailableForWork: Boolean,
  seoTitle, seoDescription, ogImage,
  siteTagline: String
}
```

---

## 🔒 SECURITY CHECKLIST

- [ ] JWT stored in httpOnly cookies (not localStorage)
- [ ] CORS restricted to frontend domain in production
- [ ] Helmet.js for security headers
- [ ] Rate limiting on contact form and login endpoint
- [ ] Input validation on all admin routes (Zod schemas)
- [ ] Cloudinary upload size limits (max 10MB per image)
- [ ] MongoDB injection prevention via Mongoose sanitization
- [ ] `.env` never committed; `.env.example` provided
- [ ] Admin panel at `/admin` — consider IP allowlist or obscure path

---

## 📱 RESPONSIVE BEHAVIOR

- Desktop (1440px+): Full cinematic experience, horizontal scroll sections enabled
- Tablet (768–1440px): Adapted grid, horizontal scroll converts to vertical
- Mobile (< 768px): Single column, GSAP animations simplified (respect `prefers-reduced-motion`), hamburger menu, touch-optimized gallery swipe
- All breakpoints tested; no horizontal overflow

---

## 🚀 DEPLOYMENT CONFIGURATION

**Frontend (Vercel)**
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- `VITE_API_URL` = Render backend URL

**Backend (Render)**
- Free tier Web Service
- `Build Command`: `npm install`
- `Start Command`: `node server.js`
- Environment variables set in Render dashboard
- MongoDB Atlas connection string in env

---

## 📋 IMPLEMENTATION ORDER (Recommended)

```
Phase 1 — Backend Foundation
  → Project setup, MongoDB connect, env config
  → Auth module (login, JWT, middleware)
  → Portfolio module (CRUD + Cloudinary upload)
  → Settings + Contact modules (Nodemailer integration)

Phase 2 — Admin Panel
  → React setup (Vite), routing, auth context
  → Admin login page
  → Portfolio manager (list, add, edit, delete, reorder)
  → Messages inbox, Settings page

Phase 3 — Public Frontend Core
  → Lenis setup + GSAP ScrollTrigger config
  → Hero section (parallax, animated type)
  → Gallery section (masonry, filter, lightbox)
  → About + Skills sections

Phase 4 — Advanced Animations & Polish
  → Horizontal scroll featured section
  → Split text reveals throughout
  → Custom cursor
  → Contact form with Nodemailer
  → Grain overlay, custom scrollbar

Phase 5 — Remaining Sections + QA
  → Services, Testimonials, Process, Footer
  → Mobile responsiveness pass
  → Performance audit (Lighthouse)
  → SEO meta tags (React Helmet Async)
  → Deployment (Vercel + Render)
```

---

## 🎯 VIBE SUMMARY

> This is not a portfolio template. This is a **statement**. When a client opens this site, they feel it before they read it — like the opening of a game trailer. The work hits first, the words confirm it. Every scroll reveals something new. The artist's name alone commands the screen. By the time they reach the contact form, they're not shopping anymore — they want *this* person.

Build accordingly.

---

*Stack: MongoDB · Express · React (Vite) · Node.js | Animations: GSAP + Lenis | Media: Cloudinary | Email: Nodemailer | Deploy: Vercel (FE) + Render (BE)*