# Music Bugle

**Site:** [https://themusicbugle.com](https://themusicbugle.com) · **Preview:** [https://music-bugle.vercel.app/](https://music-bugle.vercel.app/)

Music Bugle is a content-rich music news platform built by a small, cross-functional product team (2 engineers, 1 designer, 1 editor). Our goal is to create a publication that excels in performance, SEO, and editorial flexibility.

> *This project is a work in progress, built using user-centered design (UCD) principles. We are currently focused on improving the mobile layout and overall user experience.*

---

## The Challenge & The Mission

The Music Bugle existed for over four years as a popular WordPress site, accumulating a valuable archive of **5,000+ articles** and a dedicated readership. However, it was hampered by:
*   **Poor Performance:** Slow load times and failing Core Web Vitals.
*   **Bad UX:** A dated interface that was difficult to navigate.
*   **Revenue Blockers:** Performance issues prevented approval for monetization tools like Google AdSense.

Our mission is to **rescue this valuable asset** by migrating it to a modern architecture that delivers elite performance, a world-class user experience, and a scalable foundation for future growth.

---

## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (ISR & Draft Mode), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **CMS:** [Sanity.io](https://www.sanity.io/) – custom schemas, embedded Studio (`/admin-content`), Visual Editing, GROQ queries
*   **AI enrichment:** Sanity Functions (`functions/enrich-post`) for subtitle, tags, and category suggestions
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Payments:** [Stripe](https://stripe.com/) – donations via Embedded Checkout
*   **Email:** [Resend](https://resend.com/) – contact form delivery
*   **Comments:** [Disqus](https://disqus.com/)
*   **Analytics & ads:** Google Analytics / Tag Manager, AdSense, Termly consent
*   **Deployment:** [Vercel](https://vercel.com/) (CI/CD, Preview Deployments)

---

## Features & Architecture

| Feature | Description |
| :--- | :--- |
| **Sanity CMS Integration** | Structured content model co-designed with our editor, with draft previews and Studio at `/admin-content`. |
| **Incremental Static Regen.** | Pages pre-rendered for performance, with on-demand revalidation for fresh content without full rebuilds. |
| **AI Post Enrichment** | Sanity Function suggests subtitles, tags, and categories on publish. |
| **Search** | Site-wide article search via GROQ (`/search`). |
| **Popular & Trending** | Curated CMS pages with admin-pinned and auto-filled posts. |
| **Donation System** | Stripe Embedded Checkout for one-time support. |
| **Rich Content Embeds** | Portable Text renderer supports YouTube, custom ad blocks, and other semantic layout components. |
| **SEO** | Dynamic meta tags, Open Graph, `sitemap.xml`, and structured data (JSON-LD). |

---

## Content Architecture

The Sanity schema was co-designed with our editor to ensure it met their workflow needs, empowering them to manage all site content without engineering intervention.

*   `post` – Main article with `title`, `subtitle`, `slug`, `mainImage`, `categories`, `tags`, `author`, and `body`.
*   `author` – Standalone document with name, bio, image.
*   `category` & `tag` – Taxonomies used for filtering and grouping.
*   `popularPage` & `trendingPage` – Curated feed config (pinned posts, meta).
*   `blockContent` – Rich text schema with custom blocks for YouTube embeds, callouts, and ads.

> See `sanity/schemas/` for the exact model definitions.

---

### Local Stripe Testing with Anchor LCL

To validate our Stripe integration locally, we use **Anchor LCL**. This tool allows us to test the entire Stripe Checkout flow, including success redirects, without needing to expose your local server with tools like `ngrok`.

LCL creates a local proxy that intercepts Stripe redirects and forwards them to your Next.js app.

**How to set up and test:**

1.  **Install Anchor LCL Globally:**
    ```bash
    npm install -g @anchor-protocol/lcl-host
    ```

2.  **Update Your Environment:**
    In `.env.local`, set `SITE_URL` to the LCL host URL (used for absolute links and metadata):
    ```
    SITE_URL="http://localhost:8000"
    ```
    Open the site via that LCL URL in the browser so Stripe’s `return_url` (derived from `window.location.origin`) stays on the proxy.

3.  **Run the Servers:**
    *   In one terminal, start the Next.js development server:
        ```bash
        npm run dev
        ```
    *   In a **second terminal**, start the LCL host, forwarding to Next.js:
        ```bash
        lcl-host --forward-to http://localhost:3000
        ```
    You should see output confirming that the proxy is running on `http://localhost:8000`.

## Lighthouse Performance (WIP)

| Metric | Desktop | Mobile |
| :--- | :--- | :--- |
| **Performance** | 95 | 87 |
| **Accessibility** | 100 | 100 |
| **Best Practices**| 100 | 100 |
| **SEO** | 100 | 100 |

> Measured on a Vercel-hosted production build. Our current focus is on improving mobile performance and CLS.

---

## Our Workflow

We operate in informal one-week sprints with a development process that mirrors a professional environment:
*   **Version Control:** We use a `main` → `development` → `feature-branch` Gitflow model.
*   **Code Reviews:** All feature branches require a pull request and at least one approval from the other engineer before merging into `development`.
*   **Design Handoff:** The product designer provides high-fidelity mockups and prototypes in Figma, which we use as the source of truth for implementation.
*   **Deployment:** The Vercel integration automatically creates preview deployments for each PR, allowing the entire team to review changes before they go live.

---

## Getting Started

### Prerequisites

*   **Node.js 24.x** (see `.nvmrc` / `package.json` `engines`)
*   npm (or yarn/pnpm)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NJL611/Music_Bugle.git
   ```
2. Navigate to the project directory:
    ```bash
    cd Music_Bugle
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables. Copy `.env.example` to `.env.local` and fill in values from Sanity, Stripe, Resend, and your analytics/ads accounts:

    ```bash
    cp .env.example .env.local
    ```

    Minimum for local content browsing:
    ```
    NEXT_PUBLIC_SANITY_PROJECT_ID=
    NEXT_PUBLIC_SANITY_DATASET=
    SANITY_API_READ_TOKEN=
    ```

    Optional but required for specific features: Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`), contact form (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`), analytics/ads (`NEXT_PUBLIC_GOOGLE_*`, `NEXT_PUBLIC_ADSENSE_*`, `NEXT_PUBLIC_TERMLY_WEBSITE_UUID`), and `SITE_URL`.

5. Run the development server:
   ```bash
   npm run dev
   ```

   Studio is available at [http://localhost:3000/admin-content](http://localhost:3000/admin-content).

---

## Roadmap

*   [x] Complete data migration script. `(Done)`
*   [x] Set up core Sanity schema and Next.js architecture. `(Done)`
*   [x] Site-wide search. `(Done)`
*   [x] User analytics (Google Analytics / Tag Manager). `(Done)`
*   [x] AdSense integration in the app. `(Done)`
*   [x] AI post enrichment (subtitles, tags, categories). `(Done)`
*   [ ] Finalize mobile layout refinements (targeting improved CLS).
*   [ ] Achieve passing Core Web Vitals on all core templates.
*   [ ] **Launch V1 and complete Google AdSense approval.**

---

## Design & Product Process

Our team follows a **User-Centered Design** (UCD) approach:
*   **Close Collaboration with Design:** We maintain a tight feedback loop between engineering and design to ensure technical feasibility and pixel-perfect implementation from Figma mockups.
*   **Usability Audits:** The interface is regularly checked against Nielsen's Heuristics to identify and fix usability issues.
*   **Core Principles:** The design prioritizes content legibility, accessibility (WCAG 2.1), and fast load speeds.

---

## License

This project is licensed under the MIT License.
