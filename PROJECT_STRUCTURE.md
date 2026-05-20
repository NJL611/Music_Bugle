# Project Documentation: Music Bugle

This document provides a comprehensive overview of the files and directory structure of the **Music Bugle** project, a Next.js application for music news and features, integrated with Sanity CMS.

## 📁 Root Directory
Contains configuration files for the project environment, build process, and dependencies.

- **`.env.local`**: Local environment variables (API keys, project IDs).
- **`.eslintrc.json`**: ESLint configuration for code quality and style.
- **`.gitignore`**: Specifies files and directories to be ignored by Git.
- **`next.config.mjs`**: Next.js configuration for features like image domains, redirects, and rewrites.
- **`package.json`**: Lists project dependencies, scripts (e.g., `dev`, `build`), and metadata.
- **`postcss.config.mjs`**: Configuration for PostCSS, used by Tailwind CSS.
- **`tailwind.config.ts`**: Tailwind CSS configuration, defining themes, colors, and layout utilities.
- **`tsconfig.json`**: TypeScript configuration, including path aliases and compiler options.
- **`README.md`**: Project overview, setup instructions, and deployment guide.
- **`sanity.config.ts`**: Configuration for the Sanity Studio (Studio v3).
- **`sanity.cli.ts`**: Configuration for the Sanity CLI.

---

## 📂 `src/app`
Following the Next.js App Router pattern, this directory defines the application's routes and global layout.

### Root & Global
- **`layout.tsx`**: The root layout component. Includes fonts, metadata, and scripts like Google Analytics and Termly.
- **`page.tsx`**: The main homepage. Fetches posts from Sanity and distributes them across various sections (Carousel, Top Story, Sidebar, etc.).
- **`globals.css`**: Global CSS styles, including Tailwind directives and custom font imports.
- **`sitemap.ts`**: Generates a dynamic `sitemap.xml` for SEO.

### Main Routes
- **`/article/[slug]/page.tsx`**: The dynamic route for individual post pages.
- **`/category/[slug]/page.tsx`**: Routes for filtered content by category.
- **`/tag/[slug]/page.tsx`**: Routes for filtered content by tags.
- **`/about/page.tsx`**: The About page.
- **`/contact/page.tsx`**: The Contact page with a submission form.
- **`/support/page.tsx`**: Support/Subscription page.
- **`/search/page.tsx`**: Search results page.
- **`/payment-success/page.tsx`**: Post-checkout confirmation page.
- **`/admin-content/page.tsx`**: (Internal/Dev) Route for managing content or metadata.

### API Routes
- **`api/create-payment-intent/route.ts`**: Backend endpoint for Stripe payment processing.

---

## 📂 `src/components`
Modular UI components used throughout the application.

### `layout/`
- **`Nav.tsx`**: Top navigation bar with menu items and logo.
- **`Footer.tsx`**: Site footer with links, copyright info, and a "post feed" of recent articles.
- **`Sidebar.tsx`**: Reusable sidebar component for article lists and ads.
- **`FeedLayout.tsx`**: A wrapper for pages that show a list of posts with a sidebar.

### `posts/`
- **`PostFeed.tsx`**: A flexible component for rendering lists or grids of posts (e.g., "New Releases", "Latest News").
- **`Post.tsx`**: The card representation of a single article.
- **`PostMeta.tsx`**: Displays metadata like author and date.
- **`PortableText.tsx`**: Renders Sanity's rich text content into React components.

### `sections/`
- **`HomeSections.tsx`**: Specific sections for the homepage like `Carousel`, `TopStory`, and `LatestPosts`.
- **`PostSections.tsx`**: Components used specifically within article pages.
- **`SectionHeader.tsx`**: A standardized header for content sections with a "View All" link.
- **`ContactForm.tsx`**: The logic and UI for the contact form.
- **`CheckoutForm.tsx`**: The Stripe elements wrapper for payments.

### `ui/`
- **`Icons.tsx`**: A collection of SVG icons used across the site.
- **`Primitives.tsx`**: Low-level UI components like `AdUnit` and stylized `Button`.

---

## 📂 `src/lib` & `src/types`
Utility functions, constants, and Type definitions.

- **`lib/constants.ts`**: Centralized site configuration, including navigation items, image sizes, and ad dimensions.
- **`lib/utils.ts`**: Helper functions for Sanity image building, date formatting, and post distribution logic.
- **`lib/hooks.ts`**: Custom React hooks (if any, e.g., for scroll handling).
- **`lib/fetchers.ts`**: Shared logic for fetching data (TanStack Query or native fetch).
- **`types/sanity.ts`**: TypeScript interfaces for Sanity documents and schemas.

---

## 📂 `sanity` (The CMS)
Configurations and schemas for the content backend.

- **`sanity.blueprint.ts`**: Defines the project's content structure.
- **`schema.ts`**: Aggregates all document and object types.
- **`schemas/`**: Individual schema definitions (e.g., `post.ts`, `author.ts`, `category.ts`).
- **`lib/queries.ts`**: GROQ queries for fetching data from Sanity.
- **`lib/client.ts`**: The Sanity client instance for both client-side and server-side fetching.

---

## 📂 `functions`
Backend or Cloud functions for asynchronous tasks.

- **`enrich-post/index.ts`**: A function (likely a webhook) that processes or enriches post data automatically (e.g., generating metadata or processing images).

---

## 📂 `public`
Static assets served directly.

- **`fonts/`**: Custom web fonts used by the site.
- **`og-preview.jpg`**: Default open-graph image for social sharing.
- **`favicon.ico`**: Browser tab icon.
