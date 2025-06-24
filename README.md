# Music Bugle

**Live Demo:** [https://music-bugle.vercel.app/](https://music-bugle.vercel.app/)

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
*   **CMS:** [Sanity.io](https://www.sanity.io/) – custom schemas, Visual Editing (live previews), GROQ queries
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Payments:** [Stripe](https://stripe.com/) – donations via Hosted & Embedded Checkout
*   **Comments:** [Disqus](https://disqus.com/)
*   **Deployment:** [Vercel](https://vercel.com/) (CI/CD, Preview Deployments)

---

## Features & Architecture

| Feature | Description |
| :--- | :--- |
| **Sanity CMS Integration** | A structured content model co-designed with our editor to fit their workflow, featuring draft previews. |
| **Incremental Static Regen.** | Pages pre-rendered for performance, with on-demand revalidation for fresh content without full rebuilds. |
| **Donation System** | Integrated with Stripe for one-time support using Hosted Checkout and embedded UI components. |
| **Rich Content Embeds** | Portable Text renderer supports YouTube, custom ad blocks, and other semantic layout components. |
| **SEO** | Dynamic meta tags, Open Graph image generation, `sitemap.xml`, and structured data (JSON-LD). |

---

## Content Architecture

The Sanity schema was co-designed with our editor to ensure it met their workflow needs, empowering them to manage all site content without engineering intervention.

*   `post` – Main article with `title`, `slug`, `mainImage`, `categories`, `author`, and `body`.
*   `author` – Standalone document with name, bio, image.
*   `category` & `tag` – Taxonomies used for filtering and grouping.
*   `blockContent` – Rich text schema with custom blocks for YouTube embeds, callouts, and ads.

> See the `/schemas` folder in the `studio` directory for the exact model definitions.

---

### Local Stripe Testing with Anchor LCL

To validate our Stripe integration locally, we use **Anchor LCL**. This tool allows us to test the entire Stripe Checkout flow, including success and cancellation redirects, without needing to expose our local server to the internet with tools like `ngrok`.

LCL creates a local proxy that intercepts Stripe's webhook redirects and forwards them correctly to your `localhost`.

**How to set up and test:**

1.  **Install Anchor LCL Globally:**
    If you don't have it, install the LCL command-line tool.
    ```bash
    npm install -g @anchor-protocol/lcl-host
    ```

2.  **Update Your Environment:**
    In your `.env.local` file, set the `NEXT_PUBLIC_SITE_URL` to the default LCL host URL:
    ```
    NEXT_PUBLIC_SITE_URL="http://localhost:8000"
    ```
    Your Next.js code that creates the Stripe Checkout session should use this variable to build the `success_url` and `cancel_url`.

3.  **Run the Servers:**
    *   In one terminal, start the Next.js development server as usual:
        ```bash
        npm run dev
        ```
    *   In a **second terminal**, start the LCL host, telling it to forward requests to your Next.js app:
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
*   **Version Control:** We use a `main` -> `development` -> `feature-branch` Gitflow model.
*   **Code Reviews:** All feature branches require a pull request and at least one approval from the other engineer before merging into `develop`.
*   **Design Handoff:** The product designer provides high-fidelity mockups and prototypes in Figma, which we use as the source of truth for implementation.
*   **Deployment:** The Vercel integration automatically creates preview deployments for each PR, allowing the entire team to review changes before they go live.

---

## Getting Started

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NJL611/Music_Bugle.git
   ```
2. Navigate to the project directory:
    ```bash
    cd music_bugle
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up your environment variables. Create a `.env.local` file in the root of the project and add the following variables. You can get these from your Sanity project settings and your Disqus account.

    ```
    NEXT_PUBLIC_SANITY_PROJECT_ID=""
    NEXT_PUBLIC_SANITY_DATASET=""
    SANITY_API_READ_TOKEN=""
    ```

5. Run the development server:
   ```bash
   npm run dev
   ```
---

## Roadmap

*   [x] Complete data migration script. `(Done)`
*   [x] Set up core Sanity schema and Next.js architecture. `(Done)`
*   [ ] Finalize mobile layout refinements (targeting improved CLS).
*   [ ] Implement a robust site-wide search.
*   [ ] Achieve passing Core Web Vitals on all core templates.
*   [ ] **Launch V1 and apply for Google AdSense.**
*   [ ] Implement user analytics (e.g., Plausible or Vercel Analytics).

---

## Design & Product Process

Our team follows a **User-Centered Design** (UCD) approach:
*   **Close Collaboration with Design:** We maintain a tight feedback loop between engineering and design to ensure technical feasibility and pixel-perfect implementation from Figma mockups.
*   **Usability Audits:** The interface is regularly checked against Nielsen's Heuristics to identify and fix usability issues.
*   **Core Principles:** The design prioritizes content legibility, accessibility (WCAG 2.1), and fast load speeds.

---

## License

This project is licensed under the MIT License.