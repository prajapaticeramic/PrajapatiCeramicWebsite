# Prajapati Ceramic

A responsive pottery studio website built with React, TypeScript, Vinext, Cloudflare Workers, and D1. The Sites Vite integration is preserved for managed deployment.

## Design and structure

Warm ivory and terracotta, Libre Caslon Display headings, DM Sans body text, spacious editorial layouts, original Instagram studio photography, and clearly labeled temporary reference images. The homepage connects heritage, experiences, custom work, finishing services, guest reviews, studio locations, and bookings.

Pages: `/`, `/about`, `/experiences`, `/custom-ceramics`, `/glazing-firing`, `/gallery`, `/blog`, `/blog/[article]`, `/contact`, `/booking`, `/booking/status`, `/privacy`, `/booking-terms`, `/credits`, and protected `/admin`.

## Run locally

Use Node >=22.13. Run `npm ci`, then `npm run dev`. The portable preview defaults to http://127.0.0.1:5173. Build with `npm run build` and preview the built Worker with `npm start`.

For a new local database, first build, then apply pending migration SQL in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_spotty_bishop.sql
```

Do not reapply an already applied migration. The hosting manifest binds `DB` and Sites applies hosted migrations on publication. Local data is separate and excluded from publication.

## Staff dashboard

Production `ADMIN_EMAILS` is configured in Sites for **prajapaticeramics@gmail.com**. Sign into ChatGPT with that email at `/admin`. The platform provides authenticated identity headers; application code checks the email allowlist AND authenticated user ID on every staff endpoint. Do not expose a Worker directly without the Sites authentication gateway. The private Site initially permits only its owner; an owner using a different email must request the appropriate Site access change before an additional account can visit it.

Local mock sign-in is `/signin-with-chatgpt?return_to=/admin`, with the starter's fake account `seedy@sites.test`. Ignored `.dev.vars` can set `ADMIN_EMAILS=seedy@sites.test` for local QA. This is not included in production source or archives, and production has no mock sign-in.

Staff can publish time slots with experience, studio, date, start/end, and capacity. Only real availability should be entered. No production sessions are seeded. Closing a session stops new requests; confirmed reservations remain visible. The desk displays the latest 300 requests and 300 upcoming sessions. Paginated historical management is a future enhancement.

Pending requests do not hold seats. Acceptance assigns a matching future active session. SQLite triggers enforce capacity atomically, prevent overlapping sessions in each studio, and protect confirmed sessions from schedule changes. A cancellation releases capacity. Each studio is conservatively treated as one concurrent room; additional concurrent teaching spaces require a room model.

## Booking and inquiry lifecycle

1. Visitors choose a published slot or request a preferred date/time. Published capacity is indicative until acceptance.
2. Validated requests are persisted in D1 as `pending` and receive a private tracking link.
3. Only a SHA-256 hash of the high-entropy tracking token is stored. The visitor-facing page keeps the token in its URL fragment and uses it to retrieve the status. Keep the link private.
4. Staff agree on pricing and details directly, publish a matching session if necessary, and accept a request.
5. The tracking page immediately shows `confirmed`, `declined`, or `cancelled`, and the staff message. Staff must contact the visitor by email or phone to communicate an update.

**FormSubmit forwards new submissions to prajapaticeramics@gmail.com after saving them in D1.** `lib/formsubmit.ts` uses the documented browser-side AJAX endpoint for all booking, contact, business, personal and firing forms. It includes customer Reply-To, request reference, session or custom-order details, and an authenticated staff-dashboard link; it never sends private tracking tokens. A first-time activation email must be confirmed by the owner before FormSubmit delivers submissions. Provider acknowledgement is not proof of inbox receipt. Forwarding failure or timeout leaves the saved request and tracking link intact, and the receipt offers WhatsApp. No automatic retries are performed, to avoid duplicate emails. Existing persisted submissions remain in the staff dashboard; they are not retroactively emailed. Booking confirmations, SMS and payments remain manual. Future payments should use a provider webhook and reference IDs; never accept card data in these forms.

Inquiry forms cover general contact, business custom orders (product, quantity, logo, delivery date), personal keepsakes, and firing. They persist separately identifiable kinds and show the same truthful pending receipt. WhatsApp links open a real conversation with +977 9869421616 but do not auto-send messages.

## Editable business content

Edit `content/site.ts` for contacts, studios, descriptions, experience durations, image selections, FAQs, and blog articles. Pricing is intentionally undisclosed at the owner's request; all pricing CTAs link to WhatsApp. No sample prices appear publicly. Blog management is source-based; add an article object to publish another clean blog URL. No CMS dependency or invented authors/dates.

Original studio images from `@prajapaticeramic` live under `public/images/studio-*`. Temporary Unsplash references remain labeled by the shared `Photo` component. Replace files or update image names when original tableware / wheel photography is available. The original images are limited to the resolution publicly available from Instagram. Source credit lives on `/credits`.

## Verified sources (22 October 2026)

- Official Instagram: https://www.instagram.com/prajapaticeramic/
- Boudha Google Maps place ID: `ChIJBQiEJ1Qb6zkR7Ygj45rD77E` — P993+5V, Kathmandu 44600; regular listing 11:00–18:00 daily, holidays may vary.
- Thamel Google Maps place ID: `ChIJr0EcXtYZ6zkRTXCzuxYiXPY` — Satghumti Chowk, Kathmandu 44600. Listing displayed special holiday hours during verification; visitors are directed to check current hours.
- Media: https://kathmandupost.com/art-culture/2025/11/10/how-a-22-year-old-revived-her-family-craft
- Two short guest-review excerpts are attributed on the homepage and linked to the Thamel Google Maps listing. Review excerpts are not fabricated.

## Security, privacy, and accessibility

Same-origin JSON writes, schema validation, bound SQL, capacity triggers, staff authorization, no-store API responses, high-entropy private links, hashed short-lived network rate keys, hidden spam field, and form timing checks. Rate keys are pruned on staff refresh. These are basic spam protections; add managed bot protection if abuse warrants it. Maintain data retention operationally; staff can process deletion requests via the database administration tools. No customer information is serialized into public page output.

Semantic headings, explicit labels, keyboard focus styles, native form validation, skip navigation, dialog gallery with keyboard dismissal, expandable FAQs, mobile navigation, fixed mobile booking CTA, descriptive image alternatives, and reduced-motion support. External providers (Maps, Fonts, WhatsApp, Instagram) are disclosed in the privacy notice. Do not send sensitive information in messages.

## SEO and launch configuration

Page-specific metadata, canonical URLs, Open Graph image, LocalBusiness structured data, clean routes, robots.txt, and sitemap.xml are included. The deployed Site is initially owner-private, so it is not a public, indexable business launch. Public access must be explicitly requested. If using a custom domain, update `site.url` and the Sites `SITE_URL` environment variable together, then rebuild and redeploy.

Search Console verification and Google Analytics require the owner's account/property identifiers and are not claimed as active. Add verified identifiers and appropriate consent before enabling analytics. Read the privacy and booking terms with the business owner before a public launch; exact processing periods, class inclusions, cancellations, and delivery terms are intentionally agreed directly rather than invented.

## Verification

```sh
npx tsc --noEmit
python3 tests/test_booking_integrity.py
node tests/http-smoke.mjs
node tests/http-booking.mjs
npm run build
```

The HTTP tests require the running local preview and migrated local D1. The booking test also requires the local staff mock allowlist. It creates only clearly labeled local test records, cancels reservations, closes its slot, and resolves its inquiry. It never sends customer messages or touches hosted production records. Use a fresh local DB for repeat runs because the smoke test expects empty availability for its chosen date.

Future scope: transactional email, payment checkout, a full CMS, paginated staff history, multilingual content, product shop, room scheduling, gift vouchers, reminders, and accounts.


## Remaining-page refresh (23 October 2026)

The five main inner pages now use the approved homepage preview's ivory, terracotta and editorial serif identity. Homepage source `app/page.tsx` is unchanged; the approved animated homepage remains a separate inline preview. Main routes are `/experiences`, `/ceramics`, `/about`, `/contact`, and `/booking`. Existing auxiliary routes and request APIs remain available. Inner pages share `EditorialNav` and `EditorialFooter`; homepage retains its prior chrome and layout, with the requested six-page navigation destinations.

Original owner-supplied workshop photographs are under `public/images/studio-{friends,workshop,celebration,making,moments,proud-maker}.jpg`. Their use on Visit Us illustrates studio experiences, and does not identify which branch appears in a photo. Existing product reference photography stays visibly labeled until original product images are supplied. Replace `Photo` image names to change it.

`content/site.ts` holds studio addresses, Maps links, optional `operatingStatus`, and owner-confirmed opening hours. Hours are currently null, and visitors are directed to Maps / WhatsApp for current details. Addresses were cross-checked against the current Boudha listing and the Thamel Satghumti listing. No product catalog, prices, inventory or online checkout is invented. Business and personal inquiries use the existing persisted request endpoint and private tracking links.


## Approved animated homepage is now live

The owner explicitly requested replacing the previous hosted homepage with the latest approved Canva-matched album preview. `app/page.tsx`, `components/approved-home.tsx` and `app/approved-home.css` now implement it as native React with optimized original photos, one-second autoplay and 950ms transitions. Desktop proportions match the 1360 × 1210 reference; container units scale them without ResizeObserver. Mobile uses normal flow and touch swipe. Pause/play, previous/next, keyboard navigation, reduced motion, visibility and focus/hover pause remain available. The homepage supplies its own matching navigation and shares the editorial footer with the other pages. Booking and inquiry routes are unchanged. This supersedes the earlier note that the approved homepage was only an inline preview.


## FormSubmit activation and email verification

All shared forms save through `/api/requests`, then call `https://formsubmit.co/ajax/prajapaticeramics@gmail.com` in the browser. The endpoint is fixed in code; visitors cannot choose an arbitrary recipient. Existing same-origin validation, honeypot, submission timing, and server-side rate limiting remain active. Browser forwarding can fail due to network errors, provider restrictions, unconfirmed activation or mail filtering; the UI does not claim guaranteed inbox delivery. The studio should monitor the persisted requests dashboard as well as its inbox. Confirm FormSubmit activation in the mailbox, check Spam, and use a clearly labeled website test to verify actual delivery. `_autoresponse` is intentionally not used because FormSubmit does not support it on AJAX forms. The privacy policy and form consent disclose forwarding through FormSubmit.

## Vercel public domain (approved 23 October 2026)

`vercel.json` configures the Vercel project as a dependency-free reverse proxy to the existing Cloudflare application. The Next.js framework preset is intentionally disabled: `npm run build` produces a Worker, not `.next/routes-manifest.json`. Vercel runs `node scripts/build-vercel-gateway.mjs`, with `.vercel-gateway` as its output. All pages, assets and API calls are forwarded to the existing application; the database, booking integrity and FormSubmit integration stay there. This is a gateway, not a migration of D1 or Workers code into Vercel Functions.

The owner explicitly approved making the business website public so it can be served at `https://prajapaticeramic.vercel.app`. Staff endpoints still require authenticated identity and the existing email allowlist; customer status still requires the private reference/token. The request-origin allowlist adds only this exact production Vercel origin, not arbitrary preview deployments. Staff sign-in is handled by the original site's authentication gateway. Main source remains on `website-source` in GitHub for Vercel; the Sites source is synchronized separately. Test with `node tests/vercel-gateway.mjs`, and verify both production domains and staff protection after publication.
